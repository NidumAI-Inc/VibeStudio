# /opt/fs_api/app.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pathlib import Path
import shutil
import os
import fnmatch
import stat
import json
from tempfile import SpooledTemporaryFile

BASE_PATH = Path("/").resolve()  # Tighten this if you want a chroot-like view

def get_safe_path(requested_path: str) -> Path:
    """
    Ensure requested path stays inside BASE_PATH.
    """
    full_path = (BASE_PATH / requested_path.lstrip("/")).resolve()
    if BASE_PATH not in full_path.parents and full_path != BASE_PATH:
        raise HTTPException(status_code=403, detail="Forbidden path")
    return full_path

app = FastAPI(title="VM-FS-API", version="1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict it to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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