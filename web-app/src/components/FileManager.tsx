import 'split-pane-react/esm/themes/default.css'
import React, { useState } from 'react'
import SplitPane, { Pane } from 'split-pane-react'
import { Terminal } from 'lucide-react'
import FileExplorer from './FileExplorer'
import FileEditor from './FileEditor'
import AccessControlWrapper from './AccessControlWrapper'
import { useFileManager } from '@/hooks/useFileManager'

export default function FileManager({ streamId }: { streamId: string }) {
  const {
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
  } = useFileManager(streamId)

  const [sizes, setSizes] = useState<number[]>([30, 70])

  return (
    <AccessControlWrapper requireFiles>
      <div className='min-h-screen bg-white flex flex-col'>
        <SplitPane
          split='vertical'
          sizes={sizes}
          onChange={setSizes}
          resizerSize={4}
          sashRender={(i, active) => (
            <div
              className={`h-full cursor-col-resize ${active ? 'bg-blue-500' : 'bg-gray-200'} hover:bg-gray-300`}
              style={{ width: 4 }}
            />
          )}
          className='flex flex-1'>
          <Pane minSize={200}>
            <FileExplorer
              streamId={streamId}
              files={files}
              currentPath={currentPath}
              selectedFile={selectedFile}
              loading={loading}
              onNavigate={navigateToPath}
              onFileOpen={openFile}
              onCreateFile={createNewFile}
              onUploadFile={uploadFile}
            />
          </Pane>

          <Pane minSize={300}>
            <div className='h-full flex flex-col'>
              <FileEditor
                selectedFile={selectedFile}
                fileContent={fileContent}
                editingFile={editingFile}
                onFileContentChange={setFileContent}
                onStartEdit={() => selectedFile && setEditingFile(selectedFile)}
                onSaveFile={saveFile}
                onCancelEdit={() => setEditingFile(null)}
              />
              <footer className='h-6 flex items-center px-3 bg-gray-100 text-xs text-gray-600 border-t'>
                <span>Ln 1, Col 1</span>
                <span className='ml-4'>Spaces: 2</span>
                <span className='ml-auto flex items-center'>
                  <Terminal className='w-4 h-4 mr-1' aria-hidden />
                  Ready
                </span>
              </footer>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </AccessControlWrapper>
  )
}
