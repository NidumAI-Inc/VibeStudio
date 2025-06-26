import { useState } from 'react'
import { FormItem, FormLabel, FormDescription, FormMessage, FormField, FormControl } from '@/components/ui/form'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

const ZipUploadField = ({ control, setValue }: any) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file)
      setValue?.('file', file)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file)
      setValue?.('file', file)
    }
  }

  return (
    <FormField
      control={control}
      name='file'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Upload ZIP Folder</FormLabel>
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              'flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-colors',
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-muted'
            )}>
            <UploadCloud strokeWidth={1} className='w-18 h-18 mb-4 text-muted-foreground' />
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              Drag and drop your <strong>.zip</strong> file here
            </p>
            <p className='text-xs text-muted-foreground'>or click to browse</p>
            <input type='file' accept='.zip' onChange={handleFileChange} className='hidden' />
          </label>

          {selectedFile && <p className='text-sm mt-2 text-foreground'>Selected: {selectedFile.name}</p>}

          <FormDescription>Upload a zipped version of your project folder.</FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default ZipUploadField
