import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiService } from '@/services/api'
import { toast } from 'sonner'

interface ProjectControlsProps {
  projectName?: string
  onProjectNameUpdate?: (newName: string) => void
  isStreaming?: boolean
}

const ProjectControls = ({ projectName, onProjectNameUpdate, isStreaming }: ProjectControlsProps) => {
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [editingProjectName, setEditingProjectName] = useState(projectName || '')
  const navigate = useNavigate()
  const { projectId } = useParams()

  const handleBackToDashboard = () => {
    if (isStreaming) {
      const confirmNavigation = window.confirm(
        'You have an active chat stream in progress. Navigating away will stop the current response. Are you sure you want to continue?'
      )
      if (!confirmNavigation) return
    }
    navigate('/dashboard')
  }

  const handleEditProject = () => {
    setEditingProjectName(projectName || '')
    setIsEditingProject(true)
  }

  const handleSaveProjectName = async () => {
    if (!projectId || !editingProjectName.trim()) return

    try {
      await apiService.renameProject(projectId, editingProjectName.trim())
      onProjectNameUpdate?.(editingProjectName.trim())
      setIsEditingProject(false)
      toast.success('Project name updated successfully')
    } catch (error) {
      // console.error('Failed to update project name:', error);
      toast.error('Failed to update project name')
    }
  }

  const handleCancelEdit = () => {
    setEditingProjectName(projectName || '')
    setIsEditingProject(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveProjectName()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <div className='flex items-center space-x-3'>
      <Button
        variant='ghost'
        size='sm'
        onClick={handleBackToDashboard}
        className='text-black hover:text-gray-700 hover:bg-gray-100'>
        <ArrowLeft className='w-4 h-4 mr-2' />
        Back
      </Button>

      {projectName && (
        <div className='flex items-center space-x-2'>
          {isEditingProject ? (
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                value={editingProjectName}
                onChange={(e) => setEditingProjectName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSaveProjectName}
                className='bg-gray-100 text-black px-2 py-1 rounded text-sm border border-gray-300 focus:border-blue-500 focus:outline-none'
                autoFocus
              />
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSaveProjectName}
                className='text-green-600 hover:text-green-700 p-1'>
                Save
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCancelEdit}
                className='text-gray-600 hover:text-gray-700 p-1'>
                Cancel
              </Button>
            </div>
          ) : (
            <div className='flex items-center space-x-2'>
              <span className='text-black font-medium'>{projectName}</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleEditProject}
                className='text-gray-600 hover:text-black p-1'>
                <Edit2 className='w-3 h-3' />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectControls
