"""
main.py – single-file FastAPI gateway for Claude
with metrics, persistent credentials and GitHub auto-push per session.
"""
from fastapi import Query
import asyncio, json, os, sys, time, uuid, subprocess, shutil, stat
from pathlib import Path
from typing import Dict, Optional, AsyncGenerator
import psutil
import requests
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse , FileResponse, PlainTextResponse
from pydantic import BaseModel, Field
import json, re, psutil, asyncio, sys
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from pathlib import Path
import shutil
import os
import fnmatch
from fastapi import FastAPI, HTTPException, UploadFile, File, Body

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG & FOLDERS
# ─────────────────────────────────────────────────────────────────────────────
ROOT         = Path(__file__).parent.resolve()
RUNS_BASE    = ROOT / "runs"
CONV_BASE    = ROOT / "conversations"
PROFILE_BASE = ROOT / "user_profile"
ENV_FILE     = ROOT / "env.json"
SESSION_STORE = ROOT / "session_store"
SESSION_STORE.mkdir(exist_ok=True)
import random

ADJECTIVES = [
    "brave", "green", "silent", "fast", "wise", "shiny", "bold", "blue", "lucky", "calm"
]
NOUNS = [
    "tiger", "sky", "forest", "river", "falcon", "mountain", "code", "robot", "star", "dream"
]

def generate_project_name():
    return f"{random.choice(ADJECTIVES)}-{random.choice(NOUNS)}"

for d in (RUNS_BASE, CONV_BASE, PROFILE_BASE):
    d.mkdir(exist_ok=True)

SYSTEM_PROMPT_FILE = ROOT / "system_prompt.json"
BASE_PATH = RUNS_BASE
def get_safe_path(requested_path: str) -> Path:
    """
    Ensure requested path stays inside BASE_PATH.
    """
    full_path = (BASE_PATH / requested_path.lstrip("/")).resolve()
    if BASE_PATH not in full_path.parents and full_path != BASE_PATH:
        raise HTTPException(status_code=403, detail="Forbidden path")
    return full_path
def load_system_prompt() -> str:
    with SYSTEM_PROMPT_FILE.open("r", encoding="utf-8") as f:
        obj = json.load(f)
        return obj["system_prompt"]

ALLOWED_TOOLS = ["Write", "Bash", "Edit", "MultiEdit"]
CLAUDE_BIN    = "claude"

# ─────────────────────────────────────────────────────────────────────────────
# ENV HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _load_env() -> Dict[str,str]:
    if ENV_FILE.exists():
        return json.loads(ENV_FILE.read_text())
    return {}

def _save_env(data: Dict[str,str]) -> None:
    ENV_FILE.write_text(json.dumps(data, indent=2))
    ENV_FILE.chmod(stat.S_IRUSR | stat.S_IWUSR)

def set_env_var(k: str, v: str):
    os.environ[k] = v

def bootstrap_env():
    for k, v in _load_env().items():
        set_env_var(k, v)

bootstrap_env()

# ─────────────────────────────────────────────────────────────────────────────
# FASTAPI + MODELS
# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(title="Streaming Claude Gateway + GitHub push")
# Allow all origins (dev mode)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify list like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class StartReq(BaseModel):
    user_id:   str
    prompt:    str
    stream_id: Optional[str] = None

class StartResp(BaseModel):
    stream_id: str
    message:   str = "Started. Connect to /chat/stream/{stream_id}"

class SetupReq(BaseModel):
    anthropic_api_key: str = Field(..., alias="ANTHROPIC_API_KEY")
    github_username:   str
    github_token:      str

class SetupResp(BaseModel):
    ok:      bool   = True
    message: str   = "Credentials saved and loaded."

# ─────────────────────────────────────────────────────────────────────────────
# METRICS (embedded)
# ─────────────────────────────────────────────────────────────────────────────
def _profile_path(uid: str) -> Path:
    return PROFILE_BASE / f"{uid}.json"

def _now() -> float:
    return time.time()

def _load_profile(uid: str) -> Dict:
    p = _profile_path(uid)
    if p.exists():
        return json.loads(p.read_text())
    return {
        "user_id": uid,
        "aggregate": {
            "total_cost_usd":      0.0,
            "total_input_tokens":  0,
            "total_output_tokens": 0,
            "total_messages":      0
        },
        "sessions": {}
    }

def _save_profile(uid: str, prof: Dict):
    _profile_path(uid).write_text(json.dumps(prof, indent=2))

def _ensure_session(prof: Dict, sid: str) -> Dict:
    return prof["sessions"].setdefault(sid, {
        "created":         _now(),
        "last_activity":   _now(),
        "total_cost_usd":      0.0,
        "total_input_tokens":  0,
        "total_output_tokens": 0,
        "total_messages":      0
    })

def accumulate(uid: str, sid: str,
               cost_usd: float, in_tok: int, out_tok: int,
               msg_inc: int = 1):
    prof = _load_profile(uid)
    ses  = _ensure_session(prof, sid)

    ses["total_cost_usd"]      += cost_usd
    ses["total_input_tokens"]  += in_tok
    ses["total_output_tokens"] += out_tok
    ses["total_messages"]      += msg_inc
    ses["last_activity"]        = _now()

    agg = prof["aggregate"]
    agg["total_cost_usd"]      += cost_usd
    agg["total_input_tokens"]  += in_tok
    agg["total_output_tokens"] += out_tok
    agg["total_messages"]      += msg_inc

    _save_profile(uid, prof)

# ─────────────────────────────────────────────────────────────────────────────
# SESSION
# ─────────────────────────────────────────────────────────────────────────────
class Session:
    def __init__(self, uid: str, sid: str):
        self.user_id    = uid
        self.stream_id  = sid
        self.run_dir    = RUNS_BASE / sid
        self.conv_dir   = CONV_BASE / sid
        self.claude_id: Optional[str] = None
        self.queue: asyncio.Queue[Optional[str]] = asyncio.Queue()
        self.msg_count = 0

        # GitHub state
        self.repo_name: Optional[str] = None
        self.repo_url:  Optional[str] = None

        self.run_dir.mkdir(parents=True, exist_ok=True)
        self.conv_dir.mkdir(parents=True, exist_ok=True)
        # (self.run_dir / "settings.json").write_text(
        #     json.dumps({"default": {"allowedTools": ALLOWED_TOOLS}}, indent=2)
        # )
def save_session(session: Session):
    data = {
        "user_id": session.user_id,
        "stream_id": session.stream_id,
        "claude_id": session.claude_id,
        "repo_name": session.repo_name,
        "repo_url": session.repo_url,
    }
    with (SESSION_STORE / f"{session.stream_id}.json").open("w", encoding="utf-8") as f:
        json.dump(data, f)

def load_session(stream_id: str) -> Optional[Session]:
    path = SESSION_STORE / f"{stream_id}.json"
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
        sess = Session(data["user_id"], data["stream_id"])
        sess.claude_id = data.get("claude_id")
        sess.repo_name = data.get("repo_name")
        sess.repo_url = data.get("repo_url")
        return sess

def restore_sessions():
    for path in SESSION_STORE.glob("*.json"):
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
            sess = Session(data["user_id"], data["stream_id"])
            sess.claude_id = data.get("claude_id")
            sess.repo_name = data.get("repo_name")
            sess.repo_url = data.get("repo_url")
            sessions[sess.stream_id] = sess

sessions: Dict[str, Session] = {}
restore_sessions()

# ─────────────────────────────────────────────────────────────────────────────
# GITHUB HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _gh_headers():
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise RuntimeError("GitHub token not configured")
    return {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json"
    }

def create_repo(repo_name: str) -> str:
    """
    Create a **private** GitHub repo and return an authenticated push URL.

    We no longer run `git ls-remote` here – GitHub can take several seconds
    before the repo accepts Git traffic, and we already have retry logic in
    `git_push`.
    """
    user  = os.environ["GITHUB_USERNAME"]
    token = os.environ["GITHUB_TOKEN"]

    api     = "https://api.github.com/user/repos"
    payload = {"name": repo_name, "private": True}
    resp    = requests.post(api,
                            headers={
                                "Authorization": f"Bearer {token}",
                                "Accept":        "application/vnd.github+json"
                            },
                            json=payload,
                            timeout=30)
    if resp.status_code >= 300 and resp.status_code != 422:   # 422 = already exists
        raise RuntimeError(f"GitHub repo creation failed: {resp.text}")

    # Git will read the token from the URL, so we inject it once here.
    # GitHub recommends the `x-access-token` user placeholder.
    return f"https://x-access-token:{token}@github.com/{user}/{repo_name}.git"

# ─────────────────────────────────────────────────────────────────────────────
# ←── HERE’S THE ONLY CHANGE ──→
def git_push(path: Path, repo_url: str):
    """Initialize, commit, and push a directory to GitHub if there are changes."""
    def run(*cmd):
        try:
            return subprocess.run(
                cmd,
                cwd=path,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
        except subprocess.CalledProcessError as e:
            sys.stderr.write(
                f"\n[git-error] {' '.join(cmd)}\n"
                f"Exit code: {e.returncode}\n"
                f"stdout:\n{e.stdout}\n"
                f"stderr:\n{e.stderr}\n"
            )
            raise

    if not (path / ".git").exists():
        run("git", "init", "-q")
        run("git", "config", "user.email", "bot@example.com")
        run("git", "config", "user.name", "Claude Bot")
        run("git", "branch", "-M", "main")
        run("git", "remote", "add", "origin", repo_url)
    else:
        run("git", "remote", "set-url", "origin", repo_url)

    run("git", "add", "-A")

    # Check if there are any staged changes
    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=path,
        stdout=subprocess.PIPE,
        text=True
    )
    if not status.stdout.strip():
        sys.stderr.write("[git] No changes detected. Skipping push.\n")
        return  # ✅ Skip commit & push

    run("git", "commit", "-m", "Session update", "-q")

    # Push with --force to avoid non-fast-forward errors
    for attempt in range(15):
        try:
            run("git", "push", "-u", "origin", "main", "--force", "-q")
            return
        except subprocess.CalledProcessError:
            sys.stderr.write(f"[git-push] attempt {attempt + 1} failed, retrying...\n")
            time.sleep(3)

    raise RuntimeError("git push failed after 15 attempts")

# ─────────────────────────────────────────────────────────────────────────────
# PUSH RUNS ONLY
# ─────────────────────────────────────────────────────────────────────────────
def push_runs_to_github(session: Session):
    """
    Push only the content of runs/<stream_id> into the root of the GitHub repo.
    """
    try:
        if session.repo_name is None:
            session.repo_name = f"claude-session-{session.stream_id[:8]}-{int(time.time())}"
            session.repo_url = create_repo(session.repo_name)

        bundle_path = (ROOT / "bundle_tmp" / session.repo_name)
        if bundle_path.exists():
            shutil.rmtree(bundle_path)
        bundle_path.mkdir(parents=True, exist_ok=True)

        # Only copy content inside runs/<stream_id> to the root of the bundle
        src_path = session.run_dir
        for item in src_path.iterdir():
            dest = bundle_path / item.name
            if item.is_dir():
                shutil.copytree(item, dest)
            else:
                shutil.copy2(item, dest)

        git_push(bundle_path, session.repo_url)
        shutil.rmtree(bundle_path)
        sys.stderr.write(f"[{session.stream_id}] pushed to GitHub repo {session.repo_name}\n")

    except Exception as e:
        sys.stderr.write(f"[{session.stream_id}] GitHub push failed: {e}\n")

# ─────────────────────────────────────────────────────────────────────────────
# CLAUDE RUNNER – multi-turn with explicit --resume <session_id>
# ─────────────────────────────────────────────────────────────────────────────
async def run_claude(prompt: str, session: Session):
    """
    Stream a Claude response, grouping all JSON events per user input, 
    and saving each as a single JSON object in conversations/<stream_id>/<session_id>.jsonl.
    """
    sys_prompt = load_system_prompt()+"create a project file and folder this folder it self don't create aditional folder main folder for this project :"+f"{session.stream_id}"
    print(sys_prompt)
    cmd: list[str] = [
        CLAUDE_BIN,
        "-p", prompt,
        "--output-format", "stream-json",
        "--verbose",
        "--system-prompt", sys_prompt ,
        "--allowedTools", ",".join(ALLOWED_TOOLS),
        "--model", "claude-sonnet-4-20250514"
    ]
    if session.claude_id:
        cmd += ["--continue", session.claude_id]
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        cwd=session.run_dir,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    # Stream stderr to host log as before
    async def _stderr_forward():
        async for line in proc.stderr:
            sys.stderr.write(f"[{session.stream_id}] {line.decode()}")

    asyncio.create_task(_stderr_forward())

    # --- GROUPING LOGIC STARTS HERE ---
    turn_buffer = []  # Buffer for grouping all events per user input
    user_input = prompt  # Save the input for this turn

    async for raw in proc.stdout:
        text = raw.decode()

        try:
            obj = json.loads(text)
            session.msg_count += 1

            # Capture session_id on first init as before
            if (
                obj.get("type") == "system"
                and obj.get("subtype") == "init"
                and session.claude_id is None
                and "session_id" in obj
            ):
                session.claude_id = obj["session_id"]
                save_session(session)
                await session.queue.put(
                    json.dumps(
                        {"type": "meta", "event": "claude_id",
                         "claude_id": session.claude_id}
                    ) + "\n"
                )

            # --- Buffer every JSON event ---
            turn_buffer.append(obj)

            # --- When the turn ends, save the whole turn as one JSON line ---
            if obj.get("type") == "result" and obj.get("subtype") == "success":
                conv_path = session.conv_dir / f"{session.claude_id}.jsonl"
                turn_obj = {
                    "chat_id": str(uuid.uuid4()),
                    "user_input": user_input,
                    "response": turn_buffer
                }
                with conv_path.open("a", encoding="utf-8") as f:
                    f.write(json.dumps(turn_obj) + "\n")
            

                turn_buffer = []  # Clear buffer for next turn

                # (metrics and github as before)
                usage = obj.get("usage", {})
                accumulate(
                    session.user_id,
                    session.stream_id,
                    obj.get("cost_usd", 0.0),
                    usage.get("input_tokens", 0),
                    usage.get("output_tokens", 0),
                    session.msg_count,
                )
                session.msg_count = 0
                push_runs_to_github(session)

        except json.JSONDecodeError:
            pass  # Ignore non-JSON lines

        # Forward each chunk to UI as before
        await session.queue.put(text)

    # After process ends, send EOT marker as before
    await proc.wait()
    await session.queue.put(
        json.dumps({"type": "meta", "event": "eot"}) + "\n"
    )

# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/setup", response_model=SetupResp)
def setup_creds(req: SetupReq):
    # Step 1: Validate GitHub credentials
    headers = {
        "Authorization": f"token {req.github_token}",
        "Accept": "application/vnd.github+json"
    }
    resp = requests.get("https://api.github.com/user", headers=headers, timeout=10)
    
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid GitHub token")

    gh_data = resp.json()
    actual_username = gh_data.get("login")
    if actual_username.lower() != req.github_username.lower():
        raise HTTPException(status_code=400, detail=f"GitHub username mismatch. Token belongs to '{actual_username}'.")

    # Step 2: Save credentials
    data = _load_env()
    data["ANTHROPIC_API_KEY"] = req.anthropic_api_key
    data["GITHUB_USERNAME"]   = req.github_username
    data["GITHUB_TOKEN"]      = req.github_token
    _save_env(data)
    for k, v in data.items():
        set_env_var(k, v)

    return SetupResp(message=f"GitHub credentials validated for user '{actual_username}'.")


@app.post("/chat/start", response_model=StartResp)
async def chat_start(req: StartReq, bg: BackgroundTasks):
    if req.stream_id is None:
        sid = str(uuid.uuid4())
        project_name = generate_project_name()
        session = Session(req.user_id, sid)
        sessions[sid] = session
        save_session(session)
        # Save metadata with project name
        meta_path = CONV_BASE / sid / "meta.json"
        meta_path.write_text(json.dumps({"project_name": project_name}), encoding="utf-8")
    else:
        sid = req.stream_id
        if sid not in sessions:
            # Try to load from disk if missing in memory
            session = load_session(sid)
            if not session:
                raise HTTPException(404, "Unknown stream_id")
            sessions[sid] = session
        else:
            session = sessions[sid]
    bg.add_task(run_claude, req.prompt, session)
    return StartResp(stream_id=sid)


@app.get("/chat/stream/{stream_id}")
async def chat_stream(stream_id: str):
    sess = sessions.get(stream_id)
    if not sess:
        raise HTTPException(404, "Unknown stream_id")
    
    async def gen() -> AsyncGenerator[bytes, None]:
        while True:
            chunk = await sess.queue.get()
            if chunk is None:
                break
            
            # Check for eot meta event and break the loop
            should_break = False
            try:
                obj = json.loads(chunk)
                if obj.get("type") == "meta" and obj.get("event") == "eot":
                    should_break = True
            except Exception:
                pass
            
            yield chunk.encode() + b"\n"  # Added newline separator
            
            if should_break:
                break
    
    return StreamingResponse(
        gen(), 
        media_type="application/json",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@app.post("/session/run-app/{stream_id}")
async def run_npm_app(stream_id: str, script: str = "dev", port: int = 3455):
    run_path = RUNS_BASE / stream_id
    pkg_json = run_path / "package.json"
    # --- Add these lines here! ---
    _log_path(stream_id, "install.log").write_text("")
    _log_path(stream_id, "dev.log").write_text("")
    if not pkg_json.exists():
        raise HTTPException(404, detail="package.json not found")

    # 1) Load package.json
    pkg = json.loads(pkg_json.read_text())
    scripts = pkg.get("scripts", {})
    original = scripts.get(script)
    if not original:
        raise HTTPException(400, detail=f"Script '{script}' not defined")

    # 2) Clean out old host/port tokens
    tokens = original.split()
    clean = []
    skip_next = False
    for tok in tokens:
        if skip_next:
            skip_next = False
            continue

        # remove flags & env assignments
        if tok in ("--host", "--port"):
            skip_next = True
            continue
        if tok.startswith(("--host=", "--port=")):
            continue
        if re.match(r"^(HOST|PORT)=\S+", tok):
            continue

        clean.append(tok)

    # 3) Append our host/port
    clean += ["--host", "0.0.0.0", "--port", str(port)]
    modified = " ".join(clean)

    # 4) If changed, write back
    if modified != original:
        pkg["scripts"][script] = modified
        pkg_json.write_text(json.dumps(pkg, indent=2))
        sys.stderr.write(f"[{stream_id}] Updated '{script}' to → {modified}\n")

    # 5) Kill anything on that port
    for proc in psutil.process_iter(attrs=["pid"]):
        try:
            for conn in proc.connections(kind="inet"):
                if conn.laddr.port == port:
                    proc.kill()
                    sys.stderr.write(f"[{stream_id}] Killed pid {proc.pid} on port {port}\n")
        except (psutil.AccessDenied, psutil.NoSuchProcess):
            continue

    # 6) npm install if missing
    if not (run_path / "node_modules").exists():
        install = await asyncio.create_subprocess_exec(
            "npm", "install",
            cwd=run_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
        )
        out, _ = await install.communicate()
        decoded = out.decode(errors="ignore")
        _append_log(stream_id, "install.log", decoded)

        if install.returncode != 0:
            raise HTTPException(
                500,
                detail="npm install failed – see install.log for details"
            )

        sys.stderr.write(f"[{stream_id}] npm install done\n")


    # 7) Fire up the dev server in the background
    async def _dev():
        proc = await asyncio.create_subprocess_shell(
            f"npm run {script}",
            cwd=run_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
        )
        async for line in proc.stdout:
            decoded = line.decode(errors="ignore")
            sys.stderr.write(f"[{stream_id}]: {decoded}")
            _append_log(stream_id, "dev.log", decoded)

    asyncio.create_task(_dev())

    return {
        "message":      f"Started npm run {script} on port {port}",
        "stream_id":    stream_id,
        "script":       script,
        "effectiveCmd": modified
    }

# ─────────────────────────────────────────────────────────────────────────────
# LOG HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _log_path(stream_id: str, name: str) -> Path:
    """
    Return the absolute path for a given log file ('install.log', 'dev.log', …).
    """
    return RUNS_BASE / stream_id / name

def _append_log(stream_id: str, name: str, text: str):
    """
    Append text to the chosen log file, ensuring the directory exists.
    """
    p = _log_path(stream_id, name)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("a", encoding="utf-8", errors="ignore") as f:
        f.write(text)
class LogsResp(BaseModel):
    success:  bool
    install:  Optional[str] = None
    runtime:  Optional[str] = None
    message:  Optional[str] = None

@app.get("/session/logs/{stream_id}", response_model=LogsResp)
def get_logs(stream_id: str, tail: int = 0):
    """
    Return both install.log and dev.log for the given session.
    If `tail`>0, only the last N lines of each log are returned.
    """
    install_p = _log_path(stream_id, "install.log")
    dev_p     = _log_path(stream_id, "dev.log")

    if not install_p.exists() and not dev_p.exists():
        raise HTTPException(404, detail="No logs recorded for this session")

    def _read(p: Path) -> str:
        if not p.exists():
            return ""
        text = p.read_text(errors="ignore")
        if tail > 0:
            text = "\n".join(text.splitlines()[-tail:])
        return text

    install_log = _read(install_p)
    runtime_log = _read(dev_p)

    # crude success heuristic – no line containing "error"
    error_in_logs = any(
        "error" in line.lower()
        for line in (install_log + "\n" + runtime_log).splitlines()
    )

    return LogsResp(
        success=not error_in_logs,
        install=install_log,
        runtime=runtime_log,
        message="OK" if not error_in_logs else "Errors detected – inspect logs"
    )
@app.post("/chat/stop/{stream_id}")
async def stop_claude(stream_id: str):
    sess = sessions.get(stream_id)
    if not sess:
        raise HTTPException(404, "Unknown stream_id")
    proc = getattr(sess, "claude_proc", None)
    if proc and proc.returncode is None:
        try:
            proc.kill()
            await proc.wait()
            sess.claude_proc = None
            return JSONResponse({"status": "stopped"})
        except Exception as e:
            raise HTTPException(500, f"Failed to kill process: {e}")
    else:
        return JSONResponse({"status": "not running"})
@app.get("/")
def health_check():
    return {"status": "Vibe server is running..."}

# ---------- Browsing ---------------------------------------------------------
@app.get("/list")
def list_directory(path: str = "/"):
    directory = get_safe_path(path)
    if not directory.is_dir():
        raise HTTPException(status_code=400, detail="Not a directory")
    return [
        {
            "name": file_path.name,
            "is_dir": file_path.is_dir(),
            "size": file_path.stat().st_size,
            "mtime": file_path.stat().st_mtime,
        }
        for file_path in sorted(directory.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
    ]

@app.get("/search")
def search_files(pattern: str = "main.py", path: str = "/"):
    root_directory = get_safe_path(path)
    search_results: List[str] = []
    for file_path in root_directory.rglob("*"):
        if fnmatch.fnmatch(file_path.name, pattern):
            search_results.append(str(file_path.relative_to(BASE_PATH)))
    return search_results

# ---------- File operations --------------------------------------------------
@app.get("/cat", response_class=PlainTextResponse)
def read_file_content(path: str):
    file_path = get_safe_path(path)
    if not file_path.is_file():
        raise HTTPException(status_code=400, detail="Not a file")
    try:
        return file_path.read_text()
    except UnicodeDecodeError:
        return FileResponse(file_path)

@app.post("/write")
def write_file_content(file_data: dict):
    """
    JSON body: {"path": "...", "content": "..."}
    """
    file_path = get_safe_path(file_data["path"])
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(file_data["content"])
    return {"saved": str(file_path.relative_to(BASE_PATH)), "size": file_path.stat().st_size}

@app.post("/append")
def append_file_content(file_data: dict):
    """
    JSON body: {"path": "...", "content": "..."}
    """
    file_path = get_safe_path(file_data["path"])
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with file_path.open("a") as file_object:
        file_object.write(file_data["content"])
    return {"appended": True, "size": file_path.stat().st_size}

@app.post("/mkdir")
def create_directory(directory_data: dict):
    """
    JSON body: {"path": "..."}
    """
    directory_path = get_safe_path(directory_data["path"])
    directory_path.mkdir(parents=True, exist_ok=True)
    return {"created": str(directory_path.relative_to(BASE_PATH))}

@app.post("/move")
def move_file_path(move_data: dict):
    """
    JSON body: {"src": "...", "dst": "..."}
    """
    source_path = get_safe_path(move_data["src"])
    destination_path = get_safe_path(move_data["dst"])
    destination_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(source_path, destination_path)
    return {
        "moved": str(source_path.relative_to(BASE_PATH)),
        "to": str(destination_path.relative_to(BASE_PATH)),
    }

@app.delete("/delete")
def delete_file_or_directory(path: str):
    target_path = get_safe_path(path)
    if not target_path.exists():
        raise HTTPException(status_code=404, detail="Path not found")
    if target_path.is_dir():
        shutil.rmtree(target_path)
    else:
        target_path.unlink()
    return {"deleted": str(target_path.relative_to(BASE_PATH))}

@app.post("/chmod")
def change_file_mode(mode_data: dict):
    """
    JSON body: {"path": "...", "mode": "755"}
    """
    file_path = get_safe_path(mode_data["path"])
    os.chmod(file_path, int(mode_data["mode"], 8))
    return {
        "chmod": str(file_path.relative_to(BASE_PATH)),
        "mode": mode_data["mode"],
    }

@app.post("/upload")
async def upload_file(destination: str = "/", file: UploadFile = File(...)):
    dest_dir = get_safe_path(destination)
    if not dest_dir.is_dir():
        raise HTTPException(status_code=400, detail="Destination is not a directory")

    dest_path = dest_dir / file.filename
    dest_dir.mkdir(parents=True, exist_ok=True)

    CHUNK_SIZE = 1 * 1024 * 1024          # 1 MiB
    try:
        with dest_path.open("wb") as buffer:
            while chunk := await file.read(CHUNK_SIZE):
                buffer.write(chunk)       # write each chunk straight to disk
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

    return {"uploaded": str(dest_path.relative_to(BASE_PATH)), "size": dest_path.stat().st_size}


@app.get("/download")
def download_file(path: str):
    """
    Stream a file to the client with a proper 'Content-Disposition' header.
    """
    file_path = get_safe_path(path)
    if not file_path.is_file():
        raise HTTPException(status_code=400, detail="Not a file")
    return FileResponse(
        file_path,
        filename=file_path.name,
        headers={"Content-Disposition": f'attachment; filename="{file_path.name}"'},
    )


@app.post("/copy")
def copy_path(copy_data: dict):
    """
    JSON body: {"src": "...", "dst": "..."}
    Performs deep copy (files or directories).
    """
    source_path = get_safe_path(copy_data["src"])
    destination_path = get_safe_path(copy_data["dst"])
    if source_path.is_dir():
        shutil.copytree(source_path, destination_path, dirs_exist_ok=True)
    else:
        destination_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_path, destination_path)
    return {
        "copied": str(source_path.relative_to(BASE_PATH)),
        "to": str(destination_path.relative_to(BASE_PATH)),
    }


@app.get("/stat")
def stat_path(path: str):
    """
    Return POSIX‐style metadata for a given file/directory.
    """
    target_path = get_safe_path(path)
    stats = target_path.stat()
    return {
        "path": str(target_path.relative_to(BASE_PATH)),
        "is_dir": target_path.is_dir(),
        "size": stats.st_size,
        "mode_octal": oct(stats.st_mode & 0o777),
        "mtime": stats.st_mtime,
        "ctime": stats.st_ctime,
        "uid": stats.st_uid,
        "gid": stats.st_gid,
    }

@app.post("/kill-port/{port}")
def kill_port(port: int):
    """
    Kill all processes bound to the given TCP port.
    """
    killed = []
    for proc in psutil.process_iter(attrs=["pid", "name"]):
        try:
            for conn in proc.connections(kind="inet"):
                if conn.laddr.port == port:
                    proc.kill()
                    killed.append({"pid": proc.pid, "name": proc.info.get("name", "")})
        except (psutil.AccessDenied, psutil.NoSuchProcess):
            continue
    if not killed:
        return {"status": "no process found", "port": port}
    return {"status": "killed", "port": port, "processes": killed}

@app.get("/chat/history/{stream_id}")
def get_chat_history(
    stream_id: str,
    n: int = Query(None, description="Number of most recent turns to return (default: all)")
):
    """
    Returns the last n turns (user_input + response array) from the conversation.
    """
    import os

    # Figure out the latest conversation file for this session
    conv_dir = CONV_BASE / stream_id
    if not conv_dir.exists():
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Use the newest .jsonl file in that directory (in case of multiple Claude sessions)
    jsonl_files = sorted(conv_dir.glob("*.jsonl"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not jsonl_files:
        raise HTTPException(status_code=404, detail="No conversation file found")

    conv_path = jsonl_files[0]

    # Read .jsonl file (each line is a full turn)
    turns = []
    with conv_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                turns.append(json.loads(line))
            except Exception:
                continue

    # Only return last n if n is specified
    if n is not None:
        turns = turns[-n:]

    return {"stream_id": stream_id, "turns": turns}


@app.get("/projects")
def list_projects():
    projects = []
    for conv_dir in CONV_BASE.iterdir():
        if conv_dir.is_dir():
            stream_id = conv_dir.name
            meta_path = conv_dir / "meta.json"
            project_name = stream_id  # fallback
            if meta_path.exists():
                try:
                    project_name = json.loads(meta_path.read_text(encoding="utf-8")).get("project_name", stream_id)
                except Exception:
                    pass
            # (last_modified, num_turns as before)
            jsonl_files = sorted(conv_dir.glob("*.jsonl"), key=lambda p: p.stat().st_mtime, reverse=True)
            last_modified = None
            num_turns = 0
            if jsonl_files:
                last_modified = jsonl_files[0].stat().st_mtime
                with jsonl_files[0].open("r", encoding="utf-8") as f:
                    num_turns = sum(1 for _ in f)
            projects.append({
                "stream_id": stream_id,
                "project_name": project_name,
                "last_modified": last_modified,
                "num_turns": num_turns,
            })
    return {"projects": projects}


from pydantic import BaseModel

class RenameProjectRequest(BaseModel):
    project_name: str

@app.post("/projects/{stream_id}/rename")
def rename_project(stream_id: str, req: RenameProjectRequest):
    conv_dir = CONV_BASE / stream_id
    if not conv_dir.exists():
        raise HTTPException(status_code=404, detail="Project not found")
    meta_path = conv_dir / "meta.json"
    meta = {}
    if meta_path.exists():
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["project_name"] = req.project_name
    meta_path.write_text(json.dumps(meta), encoding="utf-8")
    return {"stream_id": stream_id, "project_name": req.project_name}
@app.post("/env")
def update_env_vars(new_vars: dict = Body(...)):
    """
    Update (or add) one or more environment variables in env.json.
    """
    data = _load_env()
    updated = []
    for k, v in new_vars.items():
        print(k,v)
        data[k] = v
        set_env_var(k, v)
        updated.append(k)
    _save_env(data)
    return {"ok": True, "updated": updated}

@app.get("/env")
def get_env_vars():
    """
    Get all environment variables stored in env.json.
    """
    data = _load_env()
    return data

@app.delete("/projects/{stream_id}")
def delete_project(stream_id: str):
    conv_dir = CONV_BASE / stream_id
    run_dir = RUNS_BASE / stream_id

    if not conv_dir.exists() and not run_dir.exists():
        raise HTTPException(status_code=404, detail="Project not found")
    # Remove conversations and runs for this project
    if conv_dir.exists():
        shutil.rmtree(conv_dir)
    if run_dir.exists():
        shutil.rmtree(run_dir)
    # Also remove from session store if present
    sess_path = SESSION_STORE / f"{stream_id}.json"
    if sess_path.exists():
        sess_path.unlink()
    return {
        "deleted": stream_id,
        "message": "Project deleted successfully."
    }

@app.get("/system-prompt")
def get_system_prompt():
    """
    Get the current system prompt.
    """
    try:
        with SYSTEM_PROMPT_FILE.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return {"system_prompt": data.get("system_prompt", "")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not read system prompt: {e}")

class SystemPromptUpdate(BaseModel):
    system_prompt: str

@app.post("/system-prompt")
def update_system_prompt(req: SystemPromptUpdate):
    """
    Update the system prompt.
    """
    try:
        SYSTEM_PROMPT_FILE.write_text(
            json.dumps({"system_prompt": req.system_prompt}, indent=2),
            encoding="utf-8"
        )
        return {"system_prompt": req.system_prompt, "updated": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not update system prompt: {e}")