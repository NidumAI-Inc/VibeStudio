
export interface SetupCredentials {
  ANTHROPIC_API_KEY: string;
  github_username: string;
  github_token: string;
}

export interface ChatStartRequest {
  user_id: string;
  prompt: string;
  stream_id?: string;
}

export interface Project {
  stream_id: string;
  project_name: string;
  last_modified: number;
  num_turns: number;
}

export interface FileItem {
  name: string;
  is_dir: boolean;
  size: number;
  mtime: number;
}
