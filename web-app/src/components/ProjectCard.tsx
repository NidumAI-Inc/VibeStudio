import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Folder, Play, Square, Trash2 } from 'lucide-react'
import { Project } from '@/services/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ProjectCardProps {
  project: Project
  isSelected: boolean
  isRunning: boolean
  onSelect: (streamId: string) => void
  onChat: (streamId: string) => void
  onFiles: (streamId: string) => void
  onRun: (streamId: string) => void
  onStop: (streamId: string) => void
  onDelete: (streamId: string) => void
}

const ProjectCard = ({
  project,
  isSelected,
  isRunning,
  onSelect,
  onChat,
  onFiles,
  onRun,
  onStop,
  onDelete,
}: ProjectCardProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const handleRunClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await onRun(project.stream_id)
    } catch (error) {
      // console.error('❌ Error in run button click handler:', error)
    }
  }

  const handleStopClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await onStop(project.stream_id)
    } catch (error) {
      // console.error('❌ Error in stop button click handler:', error)
    }
  }

  const handleDeleteClick = async () => {
    try {
      await onDelete(project.stream_id)
    } catch (error) {
      // console.error('❌ Error in delete button click handler:', error)
    }
  }

  return (
    <Card
      className={`glass border-white/10 hover:border-white/20 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-yellow-500' : ''
      }`}
      onClick={() => onSelect(project.stream_id)}>
      <CardHeader>
        <CardTitle className='text-black'>{project.project_name}</CardTitle>
        <CardDescription>
          {project.num_turns} conversations • Modified {formatDate(project.last_modified)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={(e) => {
              e.stopPropagation()
              onChat(project.stream_id)
            }}>
            <MessageSquare className='w-4 h-4 mr-1' />
            Chat
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={(e) => {
              e.stopPropagation()
              onFiles(project.stream_id)
            }}>
            <Folder className='w-4 h-4 mr-1' />
            Files
          </Button>
          {isRunning ? (
            <Button size='sm' variant='destructive' onClick={handleStopClick}>
              <Square className='w-4 h-4 mr-1' />
              Stop
            </Button>
          ) : (
            <Button size='sm' variant='outline' onClick={handleRunClick}>
              <Play className='w-4 h-4 mr-1' />
              Run
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size='sm'
                variant='outline'
                onClick={(e) => e.stopPropagation()}
                className='border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400'>
                <Trash2 className='w-4 h-4 mr-1' />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.project_name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClick} className='bg-red-600 hover:bg-red-700 text-white'>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
