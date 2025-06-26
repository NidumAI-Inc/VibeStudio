import { Switch } from '@/components/ui/switch'

interface DeveloperModeToggleProps {
  showFileExplorer: boolean
  onToggleFileExplorer: () => void
  streamId: string | null
}

const DeveloperModeToggle = ({ showFileExplorer, onToggleFileExplorer, streamId }: DeveloperModeToggleProps) => {
  if (!streamId) return null

  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-black'>Developer Mode</span>
        <Switch
          checked={showFileExplorer}
          onCheckedChange={onToggleFileExplorer}
          className='data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 [&>span]:bg-white'
        />
      </div>
    </div>
  )
}

export default DeveloperModeToggle
