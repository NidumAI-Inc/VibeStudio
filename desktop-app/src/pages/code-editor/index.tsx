import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useUpdateFile, useFileContent, useListNodes } from '@/hooks/use-node'
import useVMStore from '@/store/vm'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

import FileExplorer from '@/components/file-explorer'
import CodeEditor from '@/components/common/CodeEditor'

function CodeEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [selectedNode, setSelectedNode] = useState('')

  const vm = useVMStore((s) => s.vms.find((vm) => vm.id === id))
  const port = vm?.ports.fs_api.exposed
  const folderPath = '/nativenode'

  const { data: nodes } = useListNodes({
    id,
    port,
    status: vm?.status,
    folderPath,
  })

  const { data: fileContent } = useFileContent(id, selectedNode, port)

  const { mutate: updateFile } = useUpdateFile(port)

  const handleSave = (content: string) => {
    updateFile({ filePath: selectedNode, content })
  }

  return (
    <div className='h-screen flex flex-col'>
      <header className='h-12 flex items-center justify-between px-4 border-b'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            <ArrowLeft className='h-4 w-4' />
            Back
          </Button>
          <h1 className='text-sm font-medium'>NativeNode - {vm?.name}</h1>
        </div>
      </header>

      <div className='flex-1 flex overflow-hidden'>
        <div className={cn('w-64 flex-shrink-0 border-r', 'overflow-y-auto')}>
          <div className='py-2'>
            <div className='px-4 py-2 text-xs font-medium text-gray-400 uppercase'>Explorer - {vm?.name}</div>

            <div className='mt-2'>
              {nodes && (
                <FileExplorer
                  id={id}
                  port={port}
                  folderPath={folderPath}
                  selectedNode={selectedNode}
                  initialFileSystem={nodes}
                  setSelectedNode={setSelectedNode}
                />
              )}
            </div>
          </div>
        </div>

        <div className='flex-1 relative'>
          {selectedNode && fileContent !== undefined ? (
            <CodeEditor
              key={selectedNode}
              fileName={selectedNode}
              content={`${fileContent}`}
              onSave={handleSave}
            />
          ) : (
            <div className='h-full flex items-center justify-center text-gray-400'>
              <p>Select a file to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeEditorPage
