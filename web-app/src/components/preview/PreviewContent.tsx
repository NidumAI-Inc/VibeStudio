import { useEffect, useState, RefObject } from 'react'
import PreviewViewport from './PreviewViewport'
import PreviewReadyState from './PreviewReadyState'
import PreviewLoadingState from './PreviewLoadingState'
import PreviewErrorState from './PreviewErrorState'
import PreviewIframeLoading from './PreviewIframeLoading'
import PreviewNoFilesState from './PreviewNoFilesState'
import { ViewMode } from './ViewModeToggle'

interface PreviewContentProps {
  isRunning: boolean
  previewUrl: string | null
  iframeError: boolean
  isIframeLoading: boolean
  viewMode: ViewMode
  iframeRef: RefObject<HTMLIFrameElement>
  refreshKey: number
  connectionError: boolean
  autoRefreshCount: number
  noFiles?: boolean
  onRunApp?: () => void
  onRefresh: () => void
  onIframeLoad: () => void
  onIframeError: () => void
}

const PreviewContent = ({
  isRunning,
  previewUrl,
  iframeError,
  isIframeLoading,
  viewMode,
  iframeRef,
  refreshKey,
  connectionError,
  autoRefreshCount,
  noFiles,
  onRunApp,
  onRefresh,
  onIframeLoad,
  onIframeError,
}: PreviewContentProps) => {
  const [countdown, setCountdown] = useState(5)
  const [showLoading, setShowLoading] = useState(false)

  // Show loading briefly after refresh
  useEffect(() => {
    if (previewUrl?.includes('localhost') && isRunning && !noFiles) {
      setShowLoading(true)
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [refreshKey, previewUrl, isRunning, noFiles])

  // Countdown for auto-refresh
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (connectionError && isRunning && !noFiles) {
      setCountdown(5)
      timer = setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? 5 : prev - 1))
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [connectionError, isRunning, autoRefreshCount, noFiles])

  // 🟡 No package.json — highest priority
  if (noFiles) {
    return <PreviewNoFilesState />
  }

  // 🟡 App not started yet
  if (!isRunning && !previewUrl) {
    return <PreviewReadyState onRunApp={onRunApp} />
  }

  // 🟡 Show loader when:
  //  - localhost connection fails
  //  - iframe is transitioning after refresh
  //  - app is running but no URL yet
  if ((isRunning && !previewUrl) || connectionError || showLoading) {
    return (
      <PreviewLoadingState
        connectionError={connectionError}
        countdown={countdown}
        autoRefreshCount={autoRefreshCount}
        onRunApp={onRunApp}
        onRefresh={onRefresh}
      />
    )
  }

  // 🟡 Non-localhost iframe error (e.g., blocked content)
  if (iframeError && !connectionError && !previewUrl?.includes('localhost')) {
    return <PreviewErrorState previewUrl={previewUrl!} onRefresh={onRefresh} />
  }

  // 🟡 Iframe is still loading normally
  if (isIframeLoading) {
    return <PreviewIframeLoading />
  }

  // 🟢 Render the actual preview
  if (previewUrl) {
    return (
      <PreviewViewport
        ref={iframeRef}
        previewUrl={previewUrl}
        viewMode={viewMode}
        refreshKey={refreshKey}
        onLoad={onIframeLoad}
        onError={onIframeError}
      />
    )
  }

  // 🔁 Fallback: show loader
  return (
    <PreviewLoadingState
      connectionError={false}
      countdown={countdown}
      autoRefreshCount={autoRefreshCount}
      onRunApp={onRunApp}
      onRefresh={onRefresh}
    />
  )
}

export default PreviewContent
