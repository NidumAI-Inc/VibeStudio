import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FileIcon, FolderOpen } from 'lucide-react'
import { apiService, Project } from '@/services/api'
import Navigation from '@/components/Navigation'
import ChatInterface, { ChatInterfaceRef } from '@/components/ChatInterface'
import FileManager from '@/components/FileManager'
import PreviewPanel from '@/components/PreviewPanel'
import GeneratedCodeView from './codeViewerPanel/GeneratedCodeView'
import { useCodeDumpUIStore } from '@/store/codeDumpUIStore'
import isEqual from 'fast-deep-equal'

type ActiveView = 'chat' | 'files' | 'settings'

const ProjectView = () => {
  const { projectId, view = 'chat' } = useParams<{ projectId: string; view?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showFileExplorer, setShowFileExplorer] = useState(false)
  const showCodeDump = useCodeDumpUIStore((state) => state.showCodeDump)

  const chatInterfaceRef = useRef<ChatInterfaceRef | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [liveWrittenActions, setLiveWrittenActions] = useState<any[]>([])

  const [typed, setTyped] = useState<Record<string, string>>({})
  const [typedSet, setTypedSet] = useState<Set<string>>(new Set())

  const pollChatInterface = useCallback(() => {
    const ci = chatInterfaceRef.current
    if (!ci) return

    const currentStreaming = !!ci.isStreaming
    if (currentStreaming !== isStreaming) {
      setIsStreaming(currentStreaming)
    }

    let newActions: any[] = []
    if (currentStreaming && ci.writtenActions) {
      newActions = ci.writtenActions
    } else if (!currentStreaming && ci.turns) {
      newActions = ci.turns.flatMap((turn) => turn.writtenActions || [])
    }

    setLiveWrittenActions((prev) => (!isEqual(prev, newActions) ? newActions : prev))
  }, [isStreaming])

  useEffect(() => {
    const id = setInterval(pollChatInterface, 200)
    return () => clearInterval(id)
  }, [pollChatInterface])

  const activeView = (view as ActiveView) || 'chat'
  const initialPrompt = location.state?.initialPrompt

  useEffect(() => {
    if (projectId && projectId !== 'new') {
      loadProject(projectId)
    } else if (projectId === 'new') {
      setLoading(false)
    }
  }, [projectId])

  const loadProject = async (streamId: string) => {
    try {
      const response = await apiService.getProjects()
      const foundProject = response.projects?.find((p) => p.stream_id === streamId)
      setProject(foundProject || null)
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  const handleViewChange = (newView: ActiveView) => {
    if (projectId) {
      navigate(`/project/${projectId}/${newView}`)
    }
  }

  const handleProjectCreated = () => {
    if (projectId !== 'new') {
      loadProject(projectId!)
    }
  }

  const handleProjectNameUpdate = (newName: string) => {
    if (project) {
      setProject({ ...project, project_name: newName })
    }
  }

  const handleSendFixMessage = (message: string) => {
    if (chatInterfaceRef.current?.sendMessage) {
      chatInterfaceRef.current.sendMessage(message)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white text-black flex items-center justify-center'>
        <div className='animate-pulse'>Loading project...</div>
      </div>
    )
  }

  if (!project && projectId !== 'new') {
    return (
      <div className='min-h-screen bg-white text-black flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Project not found</h1>
          <p className='text-black'>The project you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white text-black'>
      <Navigation
        projectName={project?.project_name}
        onProjectNameUpdate={handleProjectNameUpdate}
        showFileExplorer={showFileExplorer}
        onToggleFileExplorer={() => setShowFileExplorer(!showFileExplorer)}
        streamId={projectId === 'new' ? null : projectId}
      />

      <main className='w-full pt-16'>
        {activeView === 'chat' && (
          <div className='flex h-[calc(100vh-4rem)] w-full'>
            {!showFileExplorer ? (
              <>
                <div className='w-[30%] flex flex-col border-r border-blue-200'>
                  <ChatInterface
                    ref={chatInterfaceRef}
                    streamId={project?.stream_id ?? null}
                    projectName={project?.project_name}
                    onProjectCreated={handleProjectCreated}
                    initialPrompt={initialPrompt}
                    onToggleFileExplorer={() => setShowFileExplorer(!showFileExplorer)}
                    showFileExplorer={showFileExplorer}
                    skipHistory={projectId === 'new'}
                  />
                </div>

                <div className='w-[70%] flex flex-col'>
                  {showCodeDump ? (
                    <GeneratedCodeView
                      instantRender={!isStreaming}
                      writtenActions={liveWrittenActions}
                      typed={typed}
                      setTyped={setTyped}
                      typedSet={typedSet}
                      setTypedSet={setTypedSet}
                    />
                  ) : (
                    <PreviewPanel
                      previewUrl={previewUrl}
                      streamId={projectId || ''}
                      onPreviewUrlChange={setPreviewUrl}
                      onSendFixMessage={handleSendFixMessage}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className='w-full flex flex-col'>
                <div className='p-4'>
                  <div className='flex items-center justify-between'>
                    <header className='px-6 flex py-4 gap-4 relative'>
                      <h1 className='text-2xl font-semibold text-black'>
                        <FileIcon className='inline-block w-5 h-5 mr-2 text-blue-500' />
                        Project Files
                      </h1>
                      <h2 className='text-xs font-semibold text-blue-500'>Developer Mode</h2>
                    </header>

                    <button
                      onClick={() => setShowFileExplorer(false)}
                      className='flex items-center gap-2 text-blue-500 hover:text-black transition-colors'>
                      <FolderOpen className='w-4 h-4' />
                      Back to Chat
                    </button>
                  </div>
                </div>

                {projectId !== 'new' && (
                  <div className='flex-1'>
                    <FileManager streamId={projectId!} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeView === 'files' && projectId !== 'new' && (
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <FileManager streamId={projectId!} />
          </div>
        )}

        {activeView === 'settings' && (
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center text-black py-8'>
              <p>Project settings will be available here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProjectView
