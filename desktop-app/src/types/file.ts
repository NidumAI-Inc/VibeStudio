export type FileType = 'file' | 'folder'

export interface FileNode {
  id: string
  name: string
  type: FileType
  children?: FileNode[]
  expanded?: boolean
  size?: number
  mtime?: number
}
