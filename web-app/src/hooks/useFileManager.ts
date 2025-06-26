import { useState, useEffect } from 'react'
import { apiService, FileItem } from '@/services/api'
import { toast } from 'sonner'

export const useFileManager = (streamId: string) => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFiles()
  }, [currentPath, streamId])

  const loadFiles = async () => {
    setLoading(true)
    try {
      const streamPath = currentPath === '/' ? `/${streamId}` : `/${streamId}${currentPath}`

      const response = await apiService.listFiles(streamPath)

      setFiles(response)
    } catch (error) {
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const navigateToPath = (path: string) => {
    setCurrentPath(path)
    setSelectedFile(null)
    setFileContent('')
    setEditingFile(null)
  }

  const openFile = async (filename: string, isDir: boolean) => {
    if (isDir) {
      const newPath = currentPath === '/' ? `/${filename}` : `${currentPath}/${filename}`
      navigateToPath(newPath)
    } else {
      setSelectedFile(filename)
      try {
        const streamPath = currentPath === '/' ? `/${streamId}/${filename}` : `/${streamId}${currentPath}/${filename}`
        // console.log('📖 Reading file from path:', streamPath)

        const content = await apiService.readFile(streamPath)
        setFileContent(content)
      } catch (error) {
        // console.error('Failed to read file:', error)
        toast.error('Failed to read file')
      }
    }
  }

  const saveFile = async () => {
    if (!selectedFile) return

    try {
      const streamPath =
        currentPath === '/' ? `/${streamId}/${selectedFile}` : `/${streamId}${currentPath}/${selectedFile}`
      // console.log('💾 Saving file to path:', streamPath)

      await apiService.writeFile(streamPath, fileContent)
      toast.success('File saved successfully')
      setEditingFile(null)
    } catch (error) {
      // console.error('Failed to save file:', error)
      toast.error('Failed to save file')
    }
  }

  const createNewFile = async (fileName: string) => {
    if (!fileName.trim()) return

    try {
      const streamPath = currentPath === '/' ? `/${streamId}/${fileName}` : `/${streamId}${currentPath}/${fileName}`
      // console.log('📝 Creating new file at path:', streamPath)

      await apiService.writeFile(streamPath, '')
      toast.success('File created successfully')
      loadFiles()
    } catch (error) {
      // console.error('Failed to create file:', error)
      toast.error('Failed to create file')
    }
  }

  const uploadFile = async (file: File) => {
    try {
      const streamPath = currentPath === '/' ? `/${streamId}` : `/${streamId}${currentPath}`
      // console.log('📤 Uploading file to stream path:', streamPath)

      await apiService.uploadFile(file, streamPath)
      toast.success('File uploaded successfully')
      loadFiles()
    } catch (error) {
      // console.error('Failed to upload file:', error)
      toast.error('Failed to upload file')
    }
  }

  return {
    files,
    currentPath,
    selectedFile,
    fileContent,
    editingFile,
    loading,
    setFileContent,
    setEditingFile,
    navigateToPath,
    openFile,
    saveFile,
    createNewFile,
    uploadFile,
    loadFiles,
  }
}
