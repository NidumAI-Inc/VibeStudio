export type VMType = 'VibeCoding'
export type VMStatus = 'idle' | 'starting' | 'running' | 'stopping' | 'error'
export type WebProjectType =
  | 'reactjs'
  | 'nextjs'
  | 'vue'
  | 'angular'
  | 'svelte'
  | 'static'
  | 'api'
  | 'serverless'
  | null

export type portT = {
  internal: number
  exposed: number
  enabled: boolean
  editable: boolean
  description: string
}

export type portsT = {
  glance: portT
  fs_api: portT
  vm: portT[]
}

export type deployManagerT = {
  id: string
  port: number
  application_id: string
  repo_url: string
  start_command: string[]
  description?: string
  framework?: Framework
  method?: 'zip' | 'git'
  status?: string
}

export type Framework = 'nodejs' | 'python' | 'supabase' | 'mongodb + nodejs' | 'other'

export type tunnelT = {
  id: string
  url: string
  port: number
  is_public: boolean
}

export interface domainT {
  id: string
  port: number
  domain: string
  isVerified: boolean
  isVerifying: boolean
  isRunning: boolean
}

export interface VM {
  id: string
  name: string
  type: VMType
  runType: 'binary' | 'default' | 'TTS'
  status: VMStatus
  projectType: WebProjectType
  createdAt: string
  lastStartedAt: string
  needRestart: boolean
  os: string
  version: string
  tags: string[]
  additional: Record<string, any>
  diskUrl: string
  downloaded: boolean
  ipAddress: string
  basePath: string
  resourceConfig: {
    label: string
    cpu: number
    ram: number
    description: string
  }
  ports: portsT
  deployManager?: deployManagerT[]
  tunnel?: tunnelT[]
  domains?: domainT[]
  configFilePath?: string
}

export type deployT = {
  id: string
  port: number
  status: VMStatus
}
