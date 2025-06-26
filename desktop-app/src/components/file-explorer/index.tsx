import { useState, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { FileNode, FileType } from '@/types/file'

import { useCreateNode, useDeleteNode, useRenameNode } from '@/hooks/use-node'
import { canOpenFile } from '@/utils/files'
import { listNodes } from '@/actions/nodes'
import { cn } from '@/lib/utils'

import { InlineNewItem } from './inline-new-item'
import { FileTreeItem } from './file-tree-item'
import { ContextMenu } from './context-menu'

interface FileExplorerProps {
  id: string
  port: number
  folderPath: string
  selectedNode: string | null
  initialFileSystem: FileNode[]
  setSelectedNode: (file: string) => void
}

function FileExplorer({ id, port, folderPath, initialFileSystem, selectedNode, setSelectedNode }: FileExplorerProps) {
  const queryClient = useQueryClient()

  const [fileSystem, setFileSystem] = useState<FileNode[]>(initialFileSystem)
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    node: FileNode | null
    parentPath: string[]
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
    parentPath: [],
  })

  const [inlineNewItem, setInlineNewItem] = useState<{
    active: boolean
    type: FileType | null
    parentPath: string[]
  }>({
    active: false,
    type: null,
    parentPath: [],
  })

  const [inlineRename, setInlineRename] = useState<{
    active: boolean
    node: FileNode | null
    parentPath: string[]
  }>({
    active: false,
    node: null,
    parentPath: [],
  })

  const { mutate: deleteNode } = useDeleteNode(folderPath, port)
  const { mutate: renameNode } = useRenameNode(folderPath, port)
  const { mutate: createNode } = useCreateNode(folderPath, port)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFileSystem(initialFileSystem)
  }, [initialFileSystem])

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }))
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const findNodeByPath = (nodes: FileNode[], path: string[]): FileNode | null => {
    if (path.length === 0) return null

    const currentName = path[0]
    const node = nodes.find((n) => n.name === currentName)

    if (!node) return null
    if (path.length === 1) return node

    if (node.type === 'folder' && node.children) {
      return findNodeByPath(node.children, path.slice(1))
    }

    return null
  }

  const updateNodeAtPath = (nodes: FileNode[], path: string[], updater: (node: FileNode) => FileNode): FileNode[] => {
    if (path.length === 0) return nodes

    const currentName = path[0]

    return nodes.map((node) => {
      if (node.name === currentName) {
        if (path.length === 1) {
          return updater(node)
        }

        if (node.type === 'folder' && node.children) {
          return {
            ...node,
            children: updateNodeAtPath(node.children, path.slice(1), updater),
          }
        }
      }

      return node
    })
  }

  const addNodeAtPath = (nodes: FileNode[], path: string[], newNode: FileNode): FileNode[] => {
    if (path.length === 0) {
      return [...nodes, newNode]
    }

    const currentName = path[0]

    return nodes.map((node) => {
      if (node.name === currentName && node.type === 'folder' && node.children) {
        if (path.length === 1) {
          return {
            ...node,
            children: [...node.children, newNode],
            expanded: true,
          }
        }

        return {
          ...node,
          children: addNodeAtPath(node.children, path.slice(1), newNode),
          expanded: true,
        }
      }

      return node
    })
  }

  const removeNodeAtPath = (nodes: FileNode[], path: string[], nodeName: string): FileNode[] => {
    if (path.length === 0) {
      return nodes.filter((node) => node.name !== nodeName)
    }

    const currentName = path[0]

    return nodes.map((node) => {
      if (node.name === currentName && node.type === 'folder' && node.children) {
        if (path.length === 1) {
          return {
            ...node,
            children: node.children.filter((child) => child.name !== nodeName),
          }
        }

        return {
          ...node,
          children: removeNodeAtPath(node.children, path.slice(1), nodeName),
        }
      }

      return node
    })
  }

  const handleContextMenu = (e: React.MouseEvent, node: FileNode, parentPath: string[]) => {
    e.preventDefault()
    e.stopPropagation()

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node,
      parentPath,
    })
  }

  const handleNodeClick = (node: FileNode) => {
    if (node.type === 'file') {
      if (!canOpenFile(node.name)) {
        return toast.error('File type not supported')
      }
    }
    setSelectedNode(node.id)
  }

  const toggleFolder = async (path: string[], nodeId: string) => {
    setFileSystem((prev) =>
      updateNodeAtPath(prev, path, (node) => ({
        ...node,
        expanded: !node.expanded,
      }))
    )

    if (!nodeId) return

    try {
      const children = await listNodes({ folderPath: nodeId, port, id })

      setFileSystem((prev) =>
        updateNodeAtPath(prev, path, (node) => ({
          ...node,
          children,
        }))
      )
    } catch (error) {
      console.error('Failed to load folder contents', error)
    }
  }

  const handleCreateNew = (type: FileType, parentPath: string[]) => {
    setInlineNewItem({
      active: true,
      type,
      parentPath,
    })
    setContextMenu((prev) => ({ ...prev, visible: false }))
  }

  const handleRename = (node: FileNode, parentPath: string[]) => {
    setInlineRename({
      active: true,
      node,
      parentPath,
    })
    setContextMenu((prev) => ({ ...prev, visible: false }))
  }

  const handleDelete = (node: FileNode, parentPath: string[]) => {
    setFileSystem((prevFileSystem) => removeNodeAtPath(prevFileSystem, parentPath, node.name))
    setContextMenu((prev) => ({ ...prev, visible: false }))
    deleteNode([node.id])
  }

  const handleDuplicate = (node: FileNode, parentPath: string[]) => {
    const newNode = { ...node, id: `${node.id}-copy`, name: `${node.name} copy` }
    setFileSystem((prevFileSystem) => addNodeAtPath(prevFileSystem, parentPath, newNode))
    setContextMenu((prev) => ({ ...prev, visible: false }))
  }

  const createNewItem = async (name: string) => {
    if (!inlineNewItem.type || !name.trim()) return

    const finalPath = [folderPath, ...inlineNewItem.parentPath, name].join('/')

    try {
      if (inlineNewItem.type === 'file') {
        createNode({ filePath: finalPath, content: '' })
        setSelectedNode(finalPath)

        queryClient.invalidateQueries({ queryKey: ['file-content', finalPath] })
      } else {
        createNode({ folderPath: finalPath })
      }

      setFileSystem((prev) =>
        addNodeAtPath(prev, inlineNewItem.parentPath, {
          id: finalPath,
          name,
          type: inlineNewItem.type,
          expanded: false,
        })
      )

      setInlineNewItem({ active: false, type: null, parentPath: [] })
    } catch (error) {
      console.error('Create failed', error)
      toast.error('Failed to create item')
    }
  }

  const renameItem = (newName: string) => {
    if (!inlineRename.node || !newName.trim()) return

    setFileSystem((prevFileSystem) =>
      updateNodeAtPath(prevFileSystem, inlineRename.parentPath, (node) => ({
        ...node,
        children:
          node.children?.map((child) => (child.id === inlineRename.node?.id ? { ...child, name: newName } : child)) ||
          node.children,
      }))
    )

    setInlineRename({
      active: false,
      node: null,
      parentPath: [],
    })

    const oldPath = inlineRename.node.id
    const pathInArr = oldPath.split('/')
    pathInArr.pop()
    const newPath = `${pathInArr.join('/')}/${newName}`
    renameNode(
      { oldPath, newPath },
      {
        onSuccess() {
          if (selectedNode === oldPath) {
            setSelectedNode(newPath)
          }
        },
      }
    )
  }

  const renderFileTree = (nodes: FileNode[], parentPath: string[] = []) => {
    const currentPath = parentPath.join('/')
    const inlineNewItemPath = inlineNewItem.parentPath.join('/')
    const showNewItemInput = inlineNewItem.active && currentPath === inlineNewItemPath

    return (
      <ul className={cn('pl-4', parentPath.length === 0 && 'pl-0')}>
        {nodes.map((node) => (
          <FileTreeItem
            key={node.id}
            node={node}
            parentPath={parentPath}
            selected={selectedNode === node.id}
            isRenaming={inlineRename.active && inlineRename.node?.id === node.id}
            onContextMenu={(e) => {
              if (node.type === 'folder' && !node.expanded) {
                toggleFolder([...parentPath, node.name], node.id)
              }
              handleContextMenu(e, node, parentPath)
            }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder([...parentPath, node.name], node.id)
              } else {
                handleNodeClick(node)
              }
            }}
            onToggle={() => toggleFolder([...parentPath, node.name], node.id)}
            onRename={renameItem}>
            {node.type === 'folder' && node.expanded && (
              <>{node.children && renderFileTree(node.children, [...parentPath, node.name])}</>
            )}
          </FileTreeItem>
        ))}

        {showNewItemInput && (
          <li className='pl-5'>
            <InlineNewItem
              type={inlineNewItem.type!}
              onSubmit={createNewItem}
              onCancel={() => setInlineNewItem({ active: false, type: null, parentPath: [] })}
            />
          </li>
        )}
      </ul>
    )
  }

  return (
    <div className='h-full overflow-auto p-2 bg-white text-foreground dark:bg-card dark:text-white' ref={containerRef}>
      {renderFileTree(fileSystem)}

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onCreateFile={() =>
            handleCreateNew(
              'file',
              contextMenu.node?.type === 'folder'
                ? [...contextMenu.parentPath, contextMenu.node.name]
                : contextMenu.parentPath
            )
          }
          onCreateFolder={() =>
            handleCreateNew(
              'folder',
              contextMenu.node?.type === 'folder'
                ? [...contextMenu.parentPath, contextMenu.node.name]
                : contextMenu.parentPath
            )
          }
          onRename={() => handleRename(contextMenu.node!, contextMenu.parentPath)}
          onDelete={() => handleDelete(contextMenu.node!, contextMenu.parentPath)}
          onDuplicate={() => handleDuplicate(contextMenu.node!, contextMenu.parentPath)}
        />
      )}
    </div>
  )
}

export default FileExplorer
