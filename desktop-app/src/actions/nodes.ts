import axios from 'axios'

import type { FileNode, FileType } from '@/types/file'
import { vmWait } from './vm'
import { toast } from 'sonner'
import { endPoints, root } from '@/services/end-points'

type FolderNode = {
  folderPath: string
}

type FileNodeCreate = {
  filePath: string
  content: string
}

type listNodesT = {
  folderPath: string
  port: number
  id?: string
}

export type fileNodeT = {
  name: string
  is_dir: boolean
  size?: number
  mtime?: number
}

interface UploadFolderParams {
  rootPath: string
  destination: string
  port: number
  folderName: string
}

function normalizedPathCreate(path: string) {
  const base = path?.replace('//', '/')
  return base?.startsWith('/') ? base : `/${base}`
}

export async function nodesList({ folderPath, port, id }: listNodesT): Promise<fileNodeT[]> {
  const normalizedPath = normalizedPathCreate(folderPath)

  await vmWait(id)
  return axios
    .get(`http://localhost:${port}/list`, {
      params: { path: normalizedPath },
    })
    .then((r) => r.data.filter((item: any) => (item?.name === 'boot' ? !item?.is_dir : true)))
}

export async function listNodes({ folderPath, port, id }: listNodesT): Promise<FileNode[]> {
  const normalizedPath = normalizedPathCreate(folderPath)

  await vmWait(id)
  const response = await axios.get(`http://localhost:${port}/list`, {
    params: { path: normalizedPath },
  })

  return response.data.map(
    (item: { name: string; is_dir: boolean; size?: number; mtime?: number }): FileNode => ({
      id: `${normalizedPath}/${item.name}`,
      name: item.name,
      type: item.is_dir ? ('folder' as FileType) : ('file' as FileType),
      size: item.is_dir ? undefined : item.size,
      mtime: item.mtime,
      expanded: false,
    })
  )
}

export async function getFileContent(id: string, filePath: string, port: number): Promise<string> {
  const normalizedPath = normalizedPathCreate(filePath)

  await vmWait(id)
  return axios
    .get(`http://localhost:${port}/cat`, {
      params: { path: normalizedPath },
    })
    .then((res) => (typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2)))
}

export async function createNode(params: FileNodeCreate | FolderNode, port: number): Promise<void> {
  let normalizedPath: string
  let url: string
  let body: object

  if ('filePath' in params) {
    normalizedPath = normalizedPathCreate(params.filePath)
    url = 'write'
    body = {
      path: normalizedPath,
      content: params.content,
    }
  } else {
    normalizedPath = normalizedPathCreate(params.folderPath)
    url = 'mkdir'
    body = {
      path: normalizedPath,
    }
  }

  return axios.post(`http://localhost:${port}/${url}`, body)
}

export async function updateFile(params: { filePath: string; content: string }, port: number): Promise<any> {
  const normalizedPath = normalizedPathCreate(params.filePath)

  return axios.post(`http://localhost:${port}/write`, {
    path: normalizedPath,
    content: params.content,
  })
}

export async function renameNode(params: { oldPath: string; newPath: string }, port: number): Promise<void> {
  const src = normalizedPathCreate(params.oldPath)
  const dst = normalizedPathCreate(params.newPath)

  return axios.post(`http://localhost:${port}/move`, { src, dst })
}

export async function uploadFile(params: { file: File | Blob; destination: string; port: number }) {
  const { file, destination, port } = params
  const formData = new FormData()
  formData.append('file', file)

  return axios.post(`http://localhost:${port}/upload`, formData, {
    params: { destination },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export type moveT = { src: string; dst: string }[]
export async function moveNode(port: number, type: 'move' | 'copy', nodes: moveT) {
  const promises = nodes.map((data) => axios.post(`http://localhost:${port}/${type}`, data).then((r) => r.data))

  return Promise.all(promises)
}

export async function deleteNodeRecursive(port: number, paths: string[]) {
  const promises = paths.map((path) =>
    axios
      .delete(`http://localhost:${port}/delete`, {
        params: { path },
      })
      .then((r) => r.data)
  )

  return Promise.all(promises)
}

export async function uploadFolder(payload: UploadFolderParams) {
  return axios.post(`${root.localBackendUrl}${endPoints.uploadFolder}`, payload)
}

export async function fileStats(path: string, port: number): Promise<{ is_dir: boolean; path: string }> {
  const response = await axios.get(`http://localhost:${port}/stat`, {
    params: { path },
  })

  return response.data
}

export function downloadFile(url: string, fileName?: string) {
  if (window.electronAPI?.openExternal) {
    window.electronAPI.openExternal(url)
  } else {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || ''
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

export async function downloadSelectedItems(paths: string[], port: number, id?: string) {
  for (const path of paths) {
    try {
      const stat = await fileStats(path, port)

      if (stat.is_dir) {
        toast.info(`Folder download not yet implemented: ${stat.path}`)
        continue
      }

      const url = `http://localhost:${port}/download?path=${encodeURIComponent(path)}`
      const fileName = path.split('/').pop() || 'download'
      downloadFile(url, fileName)
    } catch (error) {
      console.error(error)
      toast.error(`Failed to download: ${path}`)
    }
  }
}
