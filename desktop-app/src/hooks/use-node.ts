import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { VMStatus } from '@/types/vm'

import {
  listNodes,
  getFileContent,
  createNode,
  renameNode,
  updateFile,
  nodesList,
  moveNode,
  moveT,
  deleteNodeRecursive,
  uploadFile,
  uploadFolder,
} from '@/actions/nodes'

type listNodesT = {
  id: string
  port: number
  status: VMStatus
  folderPath: string
}
export function useListNodes({ id, port, status, folderPath }: listNodesT) {
  return useQuery({
    queryKey: ['code-nodes', id, folderPath],
    queryFn: () => listNodes({ folderPath, port, id }),
    enabled: !!id && !!folderPath && status === 'running' && !!port,
  })
}

export function useNodesList({ id, port, status, folderPath }: listNodesT) {
  return useQuery({
    queryKey: ['nodes', id, folderPath],
    queryFn: () => nodesList({ folderPath, port, id }),
    enabled: !!id && !!folderPath && status === 'running' && !!port,
  })
}

export function useFileContent(id: string, filePath: string, port: number, refetchBoolean: any = false) {
  return useQuery({
    queryKey: ['file-content', filePath],
    queryFn: () => getFileContent(id, filePath, port),
    enabled: !!filePath && !!port,
    refetchInterval: refetchBoolean,
  })
}

export function useCreateNode(id: string, port: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: any) => createNode(params, port),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes', id] })
      queryClient.invalidateQueries({ queryKey: ['code-nodes', id] })
      toast.success('Created item successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Unable to create item')
    },
  })
}

export function useUpdateFile(port: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: any) => updateFile(params, port),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['file-content', variables.filePath] })
      toast.success('Saved changes to file')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Could not save changes')
    },
  })
}

export function useRenameNode(id: string, port: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: any) => renameNode(params, port),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes', id] })
      queryClient.invalidateQueries({ queryKey: ['code-nodes', id] })
      toast.success('Renamed item')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Renaming failed')
    },
  })
}

export function useDeleteNode(id: string, port: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (filePath: string[]) => deleteNodeRecursive(port, filePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes', id] })
      queryClient.invalidateQueries({ queryKey: ['code-nodes', id] })
      toast.success('Deleted selected items')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Could not delete selected items')
    },
  })
}

export function useMoveNode(id: string, port: number, type: 'move' | 'copy') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nodes: moveT) => moveNode(port, type, nodes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes', id] })
      queryClient.invalidateQueries({ queryKey: ['code-nodes', id] })
      toast.success(`${type === 'move' ? 'Moved' : 'Copied'} items to destination`)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`${type === 'move' ? 'Move' : 'Copy'} operation failed`)
    },
  })
}

export function useUploadFile(id: string, port: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { file: File | Blob; destination: string }) => uploadFile({ ...params, port }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes', id] })
    },
    onError: (error) => {
      console.error('Upload error:', error)
    },
  })
}
type folderT = { rootPath: string; destination: string; folderName: string; port: number }
export function useFolderUpload(id: string, port: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: folderT) => uploadFolder({ ...params, port }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes', id] })
      toast.success("Folder uploaded")
    },
    onError: (error) => {
      console.error('Upload folder error:', error)
      toast.error("Folder upload failed")
    },
  })
}
