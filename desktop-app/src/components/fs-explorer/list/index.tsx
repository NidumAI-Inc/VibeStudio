import { FileWarning } from 'lucide-react'

import type { fileNodeT } from '@/actions/nodes'

import Loader from './loader'
import Items from './items'

interface props {
  nodes: fileNodeT[]
  search: string
  isLoading: boolean
  showFiles?: boolean
  selectedItems: string[]
  onSelect: (v: string, event?: React.MouseEvent, nodes?: fileNodeT[]) => void
  onNavigate: (v: string, isDir: boolean) => void
}

function List({ isLoading, nodes, search, showFiles = true, selectedItems, onSelect, onNavigate }: props) {
  return (
    <table className='min-w-full table-auto'>
      <thead className='bg-gray-50 dark:bg-muted/10 border-b border-gray-200 dark:border-muted/30 text-left text-gray-600 dark:text-gray-300 text-xs uppercase'>
        <tr>
          <th className='py-2 px-4'>Name</th>
          <th className='py-2 px-4'>Size</th>
          <th className='py-2 px-4'>Modified</th>
        </tr>
      </thead>

      <tbody className='divide-y divide-gray-100 dark:divide-muted/20'>
        {isLoading && <Loader />}

        {!isLoading && nodes?.length === 0 && (
          <tr>
            <td colSpan={3}>
              <div className='flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-12'>
                <FileWarning className='w-10 h-10 mb-2' />
                <p className='text-sm'>This folder is empty</p>
              </div>
            </td>
          </tr>
        )}

        {nodes
          ?.filter((f) => (search ? f.name.toLowerCase().includes(search.toLowerCase()) : true))
          ?.filter((f) => (showFiles ? true : f.is_dir))
          ?.map((node) => (
            <Items
              key={node.name}
              {...node}
              selected={selectedItems.includes(node.name)}
              onSelect={(e) => onSelect(node.name, e, nodes)}
              onNavigate={() => onNavigate(node.name, node.is_dir)}
            />
          ))}
      </tbody>
    </table>
  )
}

export default List
