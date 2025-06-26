import useUIStore from '@/store/ui'

import CodeEditor from './code-editor'
import CreateNew from './create-new'
import UploadModal from './upload'
import Rename from './rename'
import Delete from './delete'
import Move from './move'

function FileSystemModals() {
  const open = useUIStore((s) => s.open)

  return (
    <>
      {open === 'fs-rename' && <Rename />}

      {open === 'fs-move' && <Move />}

      {open === 'fs-delete' && <Delete />}

      {open === 'fs-create-new' && <CreateNew />}

      {open === 'fs-upload' && <UploadModal />}

      {open === 'fs-code-editor' && <CodeEditor />}
    </>
  )
}

export default FileSystemModals
