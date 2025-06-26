import { useFileContent, useUpdateFile } from '@/hooks/use-node'
import useUIStore from '@/store/ui'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import CodeEditor from '@/components/common/CodeEditor'

function CodeEditorModel() {
  const close = useUIStore((s) => s.close)
  const open = useUIStore((s) => s.open)
  const data = useUIStore((s) => s.data)

  const { data: fileContent } = useFileContent(data.id, data.filePath, data.port)
  const { mutate: updateFile } = useUpdateFile(data.port)

  const handleSave = (content: string) => {
    updateFile({ filePath: data.filePath, content })
  }

  return (
    <Dialog open={open === 'fs-code-editor'} onOpenChange={close}>
      <DialogContent
        aria-describedby='code editor dialog box'
        className='max-w-[85vw] sm:max-w-[85vw] min-w-[320px] h-[80vh] rounded-lg p-0 flex flex-col gap-0'>
        <div className='flex items-center justify-between border-b px-4 py-2 bg-gray-50 dark:bg-gray-800 relative'>
          <h2 className='text-lg font-medium truncate pr-8'>{data.filePath.split('/').pop()}</h2>
        </div>

        <div className='flex-1 overflow-auto relative'>
          {fileContent && <CodeEditor fileName={data.filePath} content={fileContent} onSave={handleSave} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CodeEditorModel
