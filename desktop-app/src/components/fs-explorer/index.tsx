import { useEffect, useRef, useState } from 'react'
import { Search, Trash2, Pencil, Copy, ArrowRightLeft, X as XIcon, Grid2X2, AlignJustify, Download } from 'lucide-react'
import { toast } from 'sonner'

import type { deployT } from '@/types/vm'

import { downloadSelectedItems, fileNodeT } from '@/actions/nodes'
import { normalizePath } from '@/lib/utils'
import { useNodesList } from '@/hooks/use-node'
import { canOpenFile } from '@/utils/files'
import useUIStore from '@/store/ui'

import { Input } from '../ui/input'

import FileSystemModals from '../models/file-system'
import TooltipBtn from '../common/tooltip-btn'
import CreateNew from './create-new'
import Navigator from './navigator'
import Grid from './grid'
import List from './list'

function FSExplorer({ id, port, status }: deployT) {
  const [lastSelectedItem, setLastSelectedItem] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [fileView, setFileView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)

  const update = useUIStore((s) => s.update)

  const { data: nodes, isLoading } = useNodesList({
    id,
    port,
    status,
    folderPath: currentPath || '/',
  })

  const currentPathArr = currentPath?.split('/').filter(Boolean) || []

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        if (nodes && nodes.length > 0) {
          setSelectedItems(nodes.map((node) => node.name))
        }
        return
      }

      if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        if (!nodes || nodes.length === 0 || !lastSelectedItem) return

        const nodeNames = nodes.map((n) => n.name)
        const lastIndex = nodeNames.indexOf(lastSelectedItem)
        if (lastIndex === -1) return

        const cols = Math.floor(containerRef.current?.clientWidth ?? 500 / 100) || 1
        let newIndex = lastIndex

        switch (e.key) {
          case 'ArrowRight':
            newIndex = Math.min(nodes.length - 1, lastIndex + 1)
            break
          case 'ArrowLeft':
            newIndex = Math.max(0, lastIndex - 1)
            break
          case 'ArrowDown':
            newIndex = Math.min(nodes.length - 1, lastIndex + cols)
            break
          case 'ArrowUp':
            newIndex = Math.max(0, lastIndex - cols)
            break
        }

        if (newIndex !== lastIndex) {
          const newItem = nodeNames[newIndex]
          setLastSelectedItem(newItem)

          setSelectedItems((prev) => {
            const minIdx = Math.min(lastIndex, newIndex)
            const maxIdx = Math.max(lastIndex, newIndex)
            const newSelection = [...prev]

            for (let i = minIdx; i <= maxIdx; i++) {
              if (!newSelection.includes(nodeNames[i])) {
                newSelection.push(nodeNames[i])
              }
            }

            return newSelection
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, lastSelectedItem])

  function onSelect(path: string, event?: React.MouseEvent, nodes?: fileNodeT[]) {
    if (!event || (!event.shiftKey && !event.ctrlKey && !event.metaKey)) {
      setSelectedItems([path])
      setLastSelectedItem(path)
      return
    }

    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
      setSelectedItems((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]))
      setLastSelectedItem(path)
      return
    }

    if (event.shiftKey && lastSelectedItem && nodes) {
      const nodeNames = nodes.map((n) => n.name)
      const currentIndex = nodeNames.indexOf(path)
      const lastIndex = nodeNames.indexOf(lastSelectedItem)

      if (currentIndex >= 0 && lastIndex >= 0) {
        const start = Math.min(currentIndex, lastIndex)
        const end = Math.max(currentIndex, lastIndex)

        const itemsInRange = nodeNames.slice(start, end + 1)

        if (event.ctrlKey || event.metaKey) {
          setSelectedItems((prev) => {
            const newSelection = [...prev]
            itemsInRange.forEach((item) => {
              if (!newSelection.includes(item)) {
                newSelection.push(item)
              }
            })
            return newSelection
          })
        } else {
          setSelectedItems(itemsInRange)
        }
      }
    }
  }

  function onNavigate(path: string) {
    setSelectedItems([])
    setCurrentPath(path)
  }

  function onRenameClick() {
    update({
      open: 'fs-rename',
      data: {
        id,
        port,
        currentName: selectedItems[0],
        currentPath,
        type: 'file',
      },
    })
  }

  function onMoveClick(type: 'move' | 'copy') {
    update({
      open: 'fs-move',
      data: {
        id,
        port,
        type,
        status,
        currentPath,
        selectedItems,
      },
    })
  }

  function onDeleteClick() {
    update({
      open: 'fs-delete',
      data: {
        id,
        port,
        currentPath,
        selectedItems,
      },
    })
  }

  function onCreateNew(type: 'file' | 'folder') {
    update({
      open: 'fs-create-new',
      data: {
        id,
        port,
        type,
        folderPath: currentPath,
      },
    })
  }

  function onFileClick(filePath: string) {
    if (!canOpenFile(filePath)) {
      return toast.error('File type not supported for viewing')
    }

    update({
      open: 'fs-code-editor',
      data: {
        id,
        port,
        filePath,
      },
    })
  }

  function onUploadClick() {
    update({
      open: 'fs-upload',
      data: {
        id,
        port,
        destination: currentPath || '/',
        type: 'file',
      },
    })
  }

  function onUploadFolderClick() {
    update({
      open: 'fs-upload',
      data: {
        id,
        port,
        destination: currentPath || '/',
        type: 'folder',
      },
    })
  }

  function onDownloadClick() {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to download')
      return
    }

    const fullPaths = selectedItems.map((name) => normalizePath(currentPath, name))

    downloadSelectedItems(fullPaths, port, id)
  }

  const clearSelection = () => setSelectedItems([])

  return (
    <>
      <div className='df gap-4 px-4 py-4 border-b'>
        {selectedItems.length > 0 && (
          <div className='df flex-1'>
            <span className='shrink-0 text-sm text-muted-foreground'>Selected: {selectedItems.length}</span>

            <TooltipBtn id='select-clear' description='Clear selection' onClick={clearSelection}>
              <XIcon />
            </TooltipBtn>

            {selectedItems.length === 1 && (
              <TooltipBtn description='Rename' onClick={onRenameClick}>
                <Pencil />
              </TooltipBtn>
            )}

            {selectedItems.length > 0 && (
              <>
                <TooltipBtn description='Move' onClick={() => onMoveClick('move')}>
                  <ArrowRightLeft />
                </TooltipBtn>

                <TooltipBtn description='Copy' onClick={() => onMoveClick('copy')}>
                  <Copy />
                </TooltipBtn>

                <TooltipBtn description='Delete' onClick={onDeleteClick}>
                  <Trash2 />
                </TooltipBtn>

                <TooltipBtn description='Download' onClick={onDownloadClick}>
                  <Download />
                </TooltipBtn>
              </>
            )}
          </div>
        )}

        <div className='relative ml-auto max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 w-4 h-4' />
          <Input
            placeholder='Search this folder'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full pl-10 py-1.5 text-sm rounded-lg border border-gray-200'
          />
        </div>

        <div className='df gap-0 border rounded-md'>
          <TooltipBtn
            variant={fileView === 'grid' ? 'secondary' : 'ghost'}
            description='View as grid'
            onClick={() => setFileView('grid')}
            className={fileView === 'grid' ? 'text-primary' : 'hover:bg-transparent'}>
            <Grid2X2 className='size-4' />
          </TooltipBtn>

          <TooltipBtn
            variant={fileView === 'list' ? 'secondary' : 'ghost'}
            description='View as list'
            onClick={() => setFileView('list')}
            className={fileView === 'list' ? 'text-primary' : 'hover:bg-transparent'}>
            <AlignJustify className='size-4' />
          </TooltipBtn>
        </div>

        <CreateNew onCreateNew={onCreateNew} onUploadClick={onUploadClick} onUploadFolderClick={onUploadFolderClick} />
      </div>

      <div className='flex items-center px-4 py-4 space-x-2'>
        <Navigator
          currentPathArr={currentPathArr}
          onRootClick={() => onNavigate('/')}
          onNavigate={(v) => {
            const toIndex = currentPath.indexOf(v)
            const newPathh = currentPath.slice(0, toIndex + v.length)
            onNavigate(newPathh)
          }}
        />
      </div>

      <div>
        {fileView === 'grid' ? (
          <Grid
            isLoading={isLoading}
            nodes={nodes}
            search={search}
            selectedItems={selectedItems}
            onSelect={onSelect}
            onNavigate={(path, isDir) => {
              if (isDir) {
                setSelectedItems([])
                setCurrentPath((p) => p + '/' + path)
              } else {
                onFileClick(currentPath + '/' + path)
              }
            }}
          />
        ) : (
          <List
            isLoading={isLoading}
            nodes={nodes}
            search={search}
            selectedItems={selectedItems}
            onSelect={onSelect}
            onNavigate={(path, isDir) => {
              if (isDir) {
                setSelectedItems([])
                setCurrentPath((p) => p + '/' + path)
              } else {
                onFileClick(currentPath + '/' + path)
              }
            }}
          />
        )}
      </div>

      <FileSystemModals />
    </>
  )
}

export default FSExplorer
