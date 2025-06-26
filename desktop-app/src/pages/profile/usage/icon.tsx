import { Server, Database, HardDrive } from "lucide-react"

function Icon({ type }: { type: string }) {
  switch (type) {
    case 'vm':
      return <Server className="h-4 w-4 text-blue-500" />
    case 'database':
      return <Database className="h-4 w-4 text-emerald-500" />
    case 'storage':
      return <HardDrive className="h-4 w-4 text-amber-500" />
    default:
      return <Server className="h-4 w-4" />
  }
}

export default Icon
