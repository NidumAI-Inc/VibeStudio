import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService, Project } from '@/services/api'
import { useAccessControl } from '@/hooks/useAccessControl'
import Navigation from '@/components/Navigation'
import ProjectSetup from '@/components/ProjectSetup'
import ProjectsGrid from '@/components/ProjectsGrid'
import DashboardHero from '@/pages/dashboard/DashboardHero'
import { toast } from 'sonner'

const Dashboard = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [runningProject, setRunningProject] = useState<string | null>(null)

  // Use authenticated user's ID from auth store instead of hardcoded value
  const {
    isLoading: accessLoading,
    hasApiSetup,
    hasExceededBudget,
    totalCost,
    canChat,
    recheckAccess,
  } = useAccessControl()

  useEffect(() => {
    loadProjects()
    // Recheck access when dashboard loads
    recheckAccess()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await apiService.getProjects()
      setProjects(response.projects || [])
    } catch (error) {
      // console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = (prompt?: string) => {
    // Check if user can chat before allowing new chat
    if (!canChat) {
      if (!hasApiSetup) {
        toast.error('Please configure your API credentials in Settings first.')
        navigate('/settings')
      } else if (hasExceededBudget) {
        toast.error(`Usage limit exceeded ($${totalCost.toFixed(2)}/$10.00). Chat is disabled.`)
      }
      return
    }

    if (prompt && prompt.trim()) {
      navigate('/project/new/chat', { state: { initialPrompt: prompt.trim() } })
    } else {
      navigate('/project/new/chat')
    }
  }

  const handleProjectChat = (streamId: string) => {
    // Check if user can chat before allowing project chat
    if (!canChat) {
      if (!hasApiSetup) {
        toast.error('Please configure your API credentials in Settings first.')
        navigate('/settings')
      } else if (hasExceededBudget) {
        toast.error(`Usage limit exceeded ($${totalCost.toFixed(2)}/$10.00). Chat is disabled.`)
      }
      return
    }

    navigate(`/project/${streamId}/chat`)
  }

  const handleProjectFiles = (streamId: string) => {
    // Files still require API setup but not budget check
    if (!hasApiSetup) {
      toast.error('Please configure your API credentials in Settings first.')
      navigate('/settings')
      return
    }

    navigate(`/project/${streamId}/files`)
  }

  const handleRunApp = async (streamId: string) => {
    // console.log('🚀 Dashboard handleRunApp called with streamId:', streamId)

    try {
      // console.log('🚀 Calling apiService.runApp...')
      const result = await apiService.runApp(streamId)
      // console.log('🚀 apiService.runApp result:', result)

      setRunningProject(streamId)
      // console.log('🚀 App started successfully, setting running state for:', streamId)
    } catch (error) {
      // console.error('❌ Error in handleRunApp:', error)
    }
  }

  const handleStopApp = async (streamId: string) => {
    // console.log('🛑 Dashboard handleStopApp called with streamId:', streamId)

    try {
      // console.log('🛑 Calling apiService.killApp...')
      const result = await apiService.killApp(streamId)
      // console.log('🛑 apiService.killApp result:', result)

      setRunningProject(null)
      // console.log('🛑 App stopped successfully, clearing running state')
    } catch (error) {
      // console.error('❌ Error in handleStopApp:', error)
    }
  }

  const handleDeleteProject = async (streamId: string) => {
    // console.log('🗑️ Dashboard handleDeleteProject called with streamId:', streamId)

    try {
      // console.log('🗑️ Calling apiService.deleteProject...')
      await apiService.deleteProject(streamId)
      // console.log('🗑️ Project deleted successfully')

      // Remove project from local state
      setProjects(projects.filter((project) => project.stream_id !== streamId))

      // Clear running state if the deleted project was running
      if (runningProject === streamId) {
        setRunningProject(null)
      }

      toast.success('Project deleted successfully')
    } catch (error) {
      // console.error('❌ Error in handleDeleteProject:', error)
      toast.error('Failed to delete project')
    }
  }

  if (loading || accessLoading) {
    return (
      <div className='min-h-screen bg-white text-gray-900 flex items-center justify-center'>
        <div className='animate-pulse text-xl'>
          <div className='flex items-center space-x-2'>
            <div className='w-6 h-6 bg-blue-500 rounded animate-pulse'></div>
            <span>Loading VibeStudio...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <Navigation />

      <div className='pt-16'>
        <main className='w-full'>
          <DashboardHero onNewChat={handleNewChat} />

          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <ProjectsGrid
              projects={projects}
              selectedProject={null}
              runningProject={runningProject}
              onNewChat={() => handleNewChat()}
              onProjectSelect={() => {}}
              onProjectChat={handleProjectChat}
              onProjectFiles={handleProjectFiles}
              onProjectRun={handleRunApp}
              onProjectStop={handleStopApp}
              onProjectDelete={handleDeleteProject}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
