import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

import { getRoot } from '../utils/path-helper';

const router = Router()

const codeFolder = getRoot()

interface FileInfo {
  id: string;
  name: string;
  type: "file" | "folder"
  children?: FileInfo[];
}

router.get('/list', async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderPath } = req.query

    if (!folderPath || typeof folderPath !== 'string') {
      res.status(400).json({ error: 'Directory path is required as a query parameter' })
      return
    }

    const finalPath = path.join(codeFolder, folderPath)

    const scanDirectory = async (currentPath: string): Promise<FileInfo[]> => {
      const contents = await fs.readdir(currentPath, { withFileTypes: true })

      const folders: FileInfo[] = []
      const files: FileInfo[] = []

      for (const item of contents) {
        const itemPath = path.join(currentPath, item.name)
        const parent = currentPath.split(codeFolder).pop().replaceAll("\\", "/")

        const fileInfo: FileInfo = {
          id: parent + `/${item.name}`,
          name: item.name,
          type: item.isDirectory() ? "folder" : "file",
        }

        if (item.isDirectory()) {
          fileInfo.children = await scanDirectory(itemPath)
          folders.push(fileInfo)
        } else {
          files.push(fileInfo)
        }
      }

      folders.sort((a, b) => a.name.localeCompare(b.name))
      files.sort((a, b) => a.name.localeCompare(b.name))

      return [...folders, ...files]
    }

    const result = await scanDirectory(finalPath)
    res.json(result)

  } catch (error) {
    console.error('Error listing files and folders:', error)
    res.status(500).json({ error: `Failed to list files and folders: ${(error as Error).message}` })
  }
})

router.get('/content', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({ error: 'File path is required as a query parameter' })
      return
    }

    const finalPath = path.join(codeFolder, filePath)
    const stats = await fs.stat(finalPath)

    if (!stats.isFile()) {
      res.status(400).json({ error: 'The specified path is not a file' })
      return
    }

    const content = await fs.readFile(finalPath, 'utf-8')
    res.json({ content })

  } catch (error) {
    console.error('Error reading file content:', error)
    res.status(500).json({ error: `Failed to read file content: ${(error as Error).message}` })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderPath, filePath, content } = req.body

    if (!folderPath && !filePath) {
      res.status(400).json({ error: 'Folder/File path is required' })
      return
    }

    if (filePath) {
      const finalPath = path.join(codeFolder, filePath)
      const directoryPath = path.dirname(finalPath)
      await fs.mkdir(directoryPath, { recursive: true })
      await fs.writeFile(finalPath, content || '', 'utf-8')

    } else {
      const finalPath = path.join(codeFolder, folderPath)
      await fs.mkdir(finalPath, { recursive: true })
    }

    res.status(201).json({ message: `${content ? "File" : "Folder"} created successfully` })

  } catch (error) {
    console.error('Error creating folder:', error)
    res.status(500).json({ error: `Failed to create folder: ${(error as Error).message}` })
  }
})

router.put("/rename", async (req: Request, res: Response): Promise<void> => {
  try {
    const { oldPath, newPath } = req.body

    if (!oldPath || !newPath) {
      res.status(400).json({ error: 'Both oldPath and newPath are required in the request body' })
      return
    }

    const finalOldPath = path.join(codeFolder, oldPath)
    try {
      await fs.stat(finalOldPath)
    } catch (error) {
      res.status(404).json({ error: 'Source path not found' })
      return
    }

    const finalNewPath = path.join(codeFolder, newPath)
    const newPathParent = path.dirname(finalNewPath)
    try {
      const stats = await fs.stat(newPathParent)
      if (!stats.isDirectory()) {
        res.status(400).json({ error: 'Destination parent path is not a directory' })
        return
      }
    } catch (error) {
      res.status(404).json({ error: 'Destination parent directory does not exist' })
      return
    }

    try {
      await fs.stat(finalNewPath)
      res.status(409).json({ error: 'Destination path already exists' })
      return
    } catch (error) {
      console.log(error)
    }

    await fs.rename(finalOldPath, finalNewPath)
    res.json({ message: 'Rename operation completed successfully', })

  } catch (error) {
    console.error('Error renaming file or folder:', error)
    res.status(500).json({ error: `Failed to rename: ${(error as Error).message}` })
  }
})

router.put('/file', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, content } = req.body

    if (!filePath || content === undefined) {
      res.status(400).json({ error: 'File path and content are required in the request body' })
      return
    }

    const finalPath = path.join(codeFolder, filePath)
    try {
      const stats = await fs.stat(finalPath)
      if (!stats.isFile()) {
        res.status(400).json({ error: 'The specified path is not a file' })
        return
      }
    } catch (error) {
      res.status(404).json({ error: 'File not found' })
      return
    }

    await fs.writeFile(finalPath, content, 'utf-8')
    res.json({ message: 'File updated successfully' })

  } catch (error) {
    console.error('Error updating file:', error)
    res.status(500).json({ error: `Failed to update file: ${(error as Error).message}` })
  }
})

router.delete('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nodePath } = req.query

    if (!nodePath || typeof nodePath !== 'string') {
      res.status(400).json({ error: 'Node path is required' })
      return
    }

    const finalPath = path.join(codeFolder, nodePath)
    let nodeType = ""

    try {
      const stats = await fs.stat(finalPath)
      nodeType = stats.isFile() ? "file" : "folder"
    } catch (error) {
      res.status(404).json({ error: 'File/Folder not found' })
      return
    }

    if (nodeType === "file") {
      await fs.unlink(finalPath)
    }
    else {
      await fs.rm(finalPath, { recursive: true })
    }

    res.json({ message: `${nodeType === "file" ? "File" : "Folder"} deleted successfully` })

  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({ error: `Failed to delete file: ${(error as Error).message}` })
  }
})

export default router
