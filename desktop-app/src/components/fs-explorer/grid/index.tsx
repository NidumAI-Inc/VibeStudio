import { FileWarning } from "lucide-react"

import type { fileNodeT } from "@/actions/nodes"

import Loader from "./loader"
import Items from "./items"

interface props {
  nodes: fileNodeT[]
  search: string
  isLoading: boolean
  showFiles?: boolean
  selectedItems: string[]
  onSelect: (v: string, event?: React.MouseEvent, nodes?: fileNodeT[]) => void
  onNavigate: (v: string, isDir: boolean) => void
}

function Grid({ isLoading, nodes, search, showFiles = true, selectedItems, onSelect, onNavigate }: props) {
  if (isLoading) {
    return <Loader />
  }

  if (nodes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 py-12">
        <FileWarning className="w-10 h-10 mb-2" />
        <p className="text-sm">This folder is empty</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-6">
      {
        nodes
          ?.filter(f => search ? f.name.toLowerCase().includes(search.toLowerCase()) : true)
          ?.filter(f => showFiles ? true : f.is_dir)
          ?.map((node) => (
            <Items
              key={node.name}
              {...node}
              selected={selectedItems.includes(node.name)}
              onSelect={e => onSelect(node.name, e, nodes)}
              onNavigate={() => onNavigate(node.name, node.is_dir)}
            />
          ))
      }
    </div>
  )
}

export default Grid