// FileEditor.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { File as FileIcon, Edit, Save, Code, Eye } from 'lucide-react'
import Editor, { OnChange, EditorProps } from '@monaco-editor/react'

interface FileEditorProps {
  selectedFile: string | null
  fileContent: string
  editingFile: string | null
  onFileContentChange: (content: string) => void
  onStartEdit: () => void
  onSaveFile: () => void
  onCancelEdit: () => void
}

const FileEditor: React.FC<FileEditorProps> = ({
  selectedFile,
  fileContent,
  editingFile,
  onFileContentChange,
  onStartEdit,
  onSaveFile,
  onCancelEdit,
}) => {
  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'css':
      case 'scss':
        return 'css'
      case 'html':
        return 'html'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      default:
        return 'plaintext'
    }
  }

  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) onFileContentChange(value)
  }

  const language = selectedFile ? getLanguage(selectedFile) : 'plaintext'
  const isReadOnly = selectedFile !== editingFile

  const editorOptions: EditorProps['options'] = {
    readOnly: isReadOnly,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    fontSize: 14,
  }

  return (
    <Card className='h-full flex flex-col bg-white border-blue-200'>
      <CardHeader className='shrink-0 bg-blue-50 border-b border-blue-200'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-black'>
            <Code className='w-5 h-5 text-blue-500' />
            {selectedFile ? (
              <>
                <span className='text-gray-600'>Editing:</span>
                <span className='text-black'>{selectedFile}</span>
              </>
            ) : (
              'File Editor'
            )}
          </CardTitle>

          {selectedFile && (
            <div className='flex space-x-2'>
              {editingFile === selectedFile ? (
                <>
                  <Button size='sm' onClick={onSaveFile} className='bg-blue-500 text-white hover:bg-blue-600'>
                    <Save className='w-4 h-4 mr-1' />
                    Save
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={onCancelEdit}
                    className='border-blue-300 text-blue-600 hover:bg-blue-50'>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={onStartEdit}
                  className='border-blue-300 text-blue-600 hover:bg-blue-50'>
                  <Edit className='w-4 h-4 mr-1' />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className='flex flex-col flex-1 p-0 overflow-hidden min-h-0'>
        {selectedFile ? (
          <div className='flex flex-col flex-1 overflow-hidden min-h-0'>
            <div className='shrink-0 px-4 py-2 bg-gray-50 border-b border-blue-200'>
              <span className='text-xs text-gray-600 uppercase tracking-wider'>{language}</span>
            </div>

            {/* Monaco Editor */}
            <div className='flex-1'>
              {/*
                The Monaco container will fill its parent,
                and provide its own scrollbars.
              */}
              <Editor
                height='100%'
                language={language}
                value={fileContent}
                onChange={handleEditorChange}
                options={editorOptions}
              />
            </div>
          </div>
        ) : (
          <div className='h-full flex items-center justify-center text-gray-600'>
            <div className='text-center'>
              <div className='mx-auto mb-6 w-fit rounded-full bg-blue-50 p-6'>
                <FileIcon className='w-12 h-12 text-blue-500' />
              </div>
              <h3 className='mb-2 text-lg font-medium text-black'>No file selected</h3>
              <p className='text-gray-500'>Choose a file from the explorer to view or edit</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FileEditor
