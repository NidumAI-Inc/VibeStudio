import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { apiService } from '@/services/api'
import { useErrorDetection } from '@/hooks/useErrorDetection'
import ViewModeToggle, { ViewMode } from './preview/ViewModeToggle'
import PreviewControls from './preview/PreviewControls'
import PreviewContent from './preview/PreviewContent'
import ErrorDetectionPopup from './ErrorDetectionPopup'
import { toast } from '@/hooks/use-toast'

interface PreviewPanelProps {
  previewUrl: string | null
  streamId?: string
  onPreviewUrlChange?: (url: string | null) => void
  onSendFixMessage?: (message: string) => void
}

const PreviewPanel = ({ previewUrl, streamId, onPreviewUrlChange, onSendFixMessage }: PreviewPanelProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [isRunning, setIsRunning] = useState(!!previewUrl)
  const [iframeError, setIframeError] = useState(false)
  const [isIframeLoading, setIsIframeLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [connectionError, setConnectionError] = useState(false)
  const [autoRefreshCount, setAutoRefreshCount] = useState(0)
  const [noFiles, setNoFiles] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { hasError, errorDetails, dismissError, checkForErrors, isChecking } = useErrorDetection(streamId)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (connectionError && isRunning && !noFiles) {
      interval = setInterval(() => {
        setAutoRefreshCount((prev) => prev + 1)
        handleRefresh()
      }, 5000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [connectionError, isRunning, noFiles])

  const waitForServerReady = async (url: string, timeout = 900000, interval = 500): Promise<boolean> => {
    const start = Date.now()

    while (Date.now() - start < timeout) {
      try {
        await fetch(url, { method: 'GET', mode: 'no-cors' })
        return true
      } catch {
        await new Promise((r) => setTimeout(r, interval))
      }
    }

    return false
  }
  const handleRunApp = async () => {
    if (!streamId) return

    try {
      setConnectionError(false)
      setAutoRefreshCount(0)
      setIframeError(false)
      setIsRunning(true)

      const result = await apiService.runApp(streamId)

      if (result.detail && result.detail.includes('package.json')) {
        toast({
          title: "Can't start app",
          description: 'package.json not found',
          variant: 'destructive',
        })
        setIsRunning(false)
        setNoFiles(true)
        return
      }

      setNoFiles(false)

      const url = 'http://localhost:3455'

      const ready = await waitForServerReady(url)

      if (!ready) {
        setConnectionError(true)
        setIsRunning(false)
        return
      }

      onPreviewUrlChange?.(url)
    } catch (error: any) {
      console.error('[Preview] Error while running app:', error)
      setIsRunning(false)
    }
  }

  const handleStopApp = async () => {
    if (!streamId) return

    try {
      await apiService.killApp(streamId)
      setIsRunning(false)
      setAutoRefreshCount(0)
      onPreviewUrlChange?.(null)
      setIframeError(false)
      setConnectionError(false)
    } catch (error) {
      // console.error('Failed to stop app:', error)
    }
  }

  const handleRefresh = () => {
    setIframeError(false)
    setConnectionError(false)
    setRefreshKey((prev) => prev + 1)
  }

  const handleIframeLoad = () => {
    setIsIframeLoading(false)
    setIframeError(false)
    setConnectionError(false)
    setAutoRefreshCount(0)
  }

  const handleIframeError = () => {
    setIsIframeLoading(false)
    setIframeError(true)

    const iframeDocument = iframeRef.current?.contentDocument
    const errorText = iframeDocument?.querySelector('#sub-frame-error-details')?.textContent?.trim() || ''

    const networkErrorPatterns = [
      'The connection was reset',
      'ERR_CONNECTION_REFUSED',
      'ERR_CONNECTION_RESET',
      'This site can’t be reached',
      'ERR_TIMED_OUT',
      'ERR_EMPTY_RESPONSE',
      'ERR_FAILED',
      'ERR_NETWORK_CHANGED',
      'No internet',
    ]

    const matched = networkErrorPatterns.find((pattern) => errorText.includes(pattern))

    if (previewUrl?.includes('localhost') && (matched || errorText.length > 0)) {
      console.warn('[Preview] Iframe network error detected:', matched || errorText)
      setConnectionError(true)
    }
  }

  const handleTryFix = () => {
    // console.log('🔧 Try fix button clicked from PreviewPanel')

    if (errorDetails && onSendFixMessage) {
      // Import the error fix prompt generator
      import('@/utils/errorFixPrompt').then(({ generateErrorFixPrompt }) => {
        const fixPrompt = generateErrorFixPrompt({
          install: errorDetails.install,
          runtime: errorDetails.runtime,
          streamId: streamId || '',
        })

        // // console.log('🔧 Generated fix prompt:', fixPrompt);

        // Send the fix prompt to chat
        onSendFixMessage(fixPrompt)

        // Dismiss the error popup
        dismissError()
      })
    }
  }

  return (
    <div className='flex flex-col h-full p-4 bg-white'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-semibold text-gray-900'>Live Preview</h3>
        <div className='flex items-center gap-3'>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <PreviewControls
            isRunning={isRunning}
            previewUrl={previewUrl}
            onRunApp={streamId ? handleRunApp : undefined}
            onKillApp={streamId ? handleStopApp : undefined}
            onRefresh={handleRefresh}
            onCheckErrors={checkForErrors}
            isCheckingErrors={isChecking}
          />
        </div>
      </div>

      <Card className='flex-1 bg-white border-gray-200'>
        <CardContent className='p-0 h-full'>
          <PreviewContent
            isRunning={isRunning}
            previewUrl={previewUrl}
            iframeError={iframeError || connectionError}
            isIframeLoading={isIframeLoading}
            viewMode={viewMode}
            iframeRef={iframeRef}
            onRunApp={streamId ? handleRunApp : undefined}
            onRefresh={handleRefresh}
            onIframeLoad={handleIframeLoad}
            onIframeError={handleIframeError}
            refreshKey={refreshKey}
            connectionError={connectionError}
            autoRefreshCount={autoRefreshCount}
            noFiles={noFiles}
          />
        </CardContent>
      </Card>

      {/* Error Detection Popup */}
      <ErrorDetectionPopup
        isOpen={hasError}
        onClose={dismissError}
        onTryFix={handleTryFix}
        errorDetails={errorDetails}
      />
    </div>
  )
}

export default PreviewPanel
