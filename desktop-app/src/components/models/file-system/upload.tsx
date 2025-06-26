import { useRef, useState } from 'react'
import { File, Folder, Loader2, MousePointerClickIcon, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

import { useFolderUpload, useUploadFile } from '@/hooks/use-node'
import useUIStore from '@/store/ui'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

function UploadModal() {
  const { open, close, data } = useUIStore()

  const inputRef = useRef<HTMLInputElement>(null)

  const [currentFileName, setCurrentFileName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [count, setCount] = useState(0)

  const { mutateAsync: uploadFileAsync, isPending: isFileUploading } = useUploadFile(data?.id, data?.port)
  const { mutate: uploadFolder, isPending: isFolderUploading } = useFolderUpload(data?.id, data?.port)

  async function triggerFolderSelect() {
    const selected = await window.electronAPI.selectFolder()
    if (!selected) return

    const folderName = selected.split(/[\\/]/).pop() || ''
    const payload = {
      rootPath: selected,
      destination: data?.destination,
      folderName,
      port: data?.port,
    }
    uploadFolder(payload, {
      onSuccess: () => close(),
    })
  }

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || isUploading) return

    setIsUploading(true)
    const files = Array.from(fileList)
    setCount(files.length)

    let successCount = 0

    for await (const file of files) {
      setCurrentFileName(file.name)
      try {
        await uploadFileAsync({ file, destination: data?.destination })
        successCount++
      } catch {
        // Optional: log failed file names
      }
    }

    setIsUploading(false)
    close()

    if (successCount > 0) {
      toast.success(`${successCount > 1 ? 'Files' : 'File'} uploaded`)
    } else {
      toast.error('File upload failed')
    }
  }

  const isLoading = isFolderUploading || isFileUploading
  const isFolder = data?.type === 'folder'

  return (
    <Dialog open={open === 'fs-upload'} onOpenChange={(v) => !v && close()}>
      <DialogContent className='max-w-md' aria-describedby='upload-description'>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {isFolder ? (
                <Folder strokeWidth={2.4} size={20} className=' text-blue-500' />
              ) : (
                <File strokeWidth={2.4} size={20} className=' text-blue-500' />
              )}
              Upload {isFolder ? 'Folder' : 'File'}
            </DialogTitle>
          </DialogHeader>
        </DialogHeader>
        <DialogDescription id='upload-description' className='sr-only'>
          Drag & drop or click to select {isFolder ? 'a folder' : 'files'} for upload.
        </DialogDescription>
        <div
          className={`flex flex-col items-center justify-center p-28 border border-dashed rounded-lg ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleUpload(e.dataTransfer.files)
          }}
          onClick={() => {
            if (isFolder) triggerFolderSelect()
            else inputRef.current?.click()
          }}>
          <div className='min-h-[140px] flex flex-col items-center justify-center space-y-4'>
            {isUploading || isLoading ? (
              <>
                <Loader2 className='animate-spin h-6 w-6 text-blue-500' />
                <p className='text-sm text-center text-gray-700'>Uploading: {currentFileName}</p>
                {!isFolder && <p className='text-xs text-center text-gray-500'>{count} item{count === 1 ? '' : 's'}</p>}
              </>
            ) : (
              <>
                <UploadCloud strokeWidth={1} className='w-14 h-14 text-blue-500' />
                <p className='text-sm text-gray-700 flex flex-row'>
                  Drag & drop or click
                  <MousePointerClickIcon className='ml-1 text-blue-500' strokeWidth={1.5} size={20} />
                </p>
                <p className='text-xs text-gray-500'>{isFolder ? 'Folder' : 'File'} upload</p>
                <p className='text-xs text-center text-gray-500'>You can upload a file with a maximum size of 500MB.</p>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type='file'
            className='hidden'
            multiple
            {...(isFolder ? { webkitdirectory: '' } : {})}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadModal
