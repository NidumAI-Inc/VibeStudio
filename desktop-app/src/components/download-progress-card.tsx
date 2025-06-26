import { useState, useEffect } from 'react'
import { Minus } from 'lucide-react'

import { Progress } from '@/components/ui/progress'

function isMac() {
  return /Mac/i.test(navigator.platform)
}

function DownloadProgressCard() {
  const [progress, setProgress] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const mac = isMac()

  useEffect(() => {
    const handleVmOutput = (_: any, data: any) => {
      if (data?.progress?.percent) setProgress(data?.progress?.percent)
    }

    const wrapper = window.ipcRenderer?.on('app-updater', handleVmOutput)

    return () => {
      if (wrapper) {
        // @ts-ignore
        window.ipcRenderer?.off('app-updater', wrapper)
      }
    }
  }, [])

  if (!(progress > 0 && progress < 100)) {
    return null
  }

  return (
    <>
      {!isMinimized && (
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 border dark:border-neutral-700 rounded-2xl shadow-md p-4 max-w-md w-full mx-auto transition-colors duration-300'>
          {mac ? (
            <div
              onClick={() => setIsMinimized(true)}
              className='absolute top-3 left-3 w-2 h-2 flex items-center justify-center rounded-full bg-yellow-400 shadow hover:brightness-110 transition cursor-pointer'
              title='Minimize'>
              <Minus className='w-2.5 h-2.5 text-white/70 dark:text-black/70' />
            </div>
          ) : (
            <button
              onClick={() => setIsMinimized(true)}
              className='absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition'
              title='Minimize'>
              <Minus className='w-4 h-4 text-neutral-600 dark:text-neutral-100' />
            </button>
          )}

          <div className='mt-8 mb-2 flex justify-between items-center'>
            <span className='text-sm font-semibold text-neutral-700 dark:text-neutral-300'>Downloading Update</span>
            <span className='text-sm text-neutral-500 dark:text-neutral-400'>{Math.floor(progress)}%</span>
          </div>

          <Progress
            value={progress}
            className='bg-neutral-300 dark:bg-neutral-800'
            barClassName='bg-blue-600 dark:bg-white/90'
          />
        </div>
      )}

      {isMinimized && progress < 100 && (
        <button
          onClick={() => setIsMinimized(false)}
          className='fixed bottom-8 left-8 bg-white dark:bg-neutral-900 shadow-lg border dark:border-neutral-700 rounded-full w-12 h-12 flex items-center justify-center transition-all'>
          <svg className='w-8 h-8' viewBox='0 0 40 40'>
            <circle
              className='text-neutral-300 dark:text-neutral-700'
              stroke='currentColor'
              strokeWidth='5'
              fill='transparent'
              r='16'
              cx='20'
              cy='20'
            />
            <circle
              className='text-blue-600 dark:text-blue-500'
              stroke='currentColor'
              strokeWidth='5'
              strokeDasharray={100}
              strokeDashoffset={100 - progress}
              strokeLinecap='round'
              fill='transparent'
              r='16'
              cx='20'
              cy='20'
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
        </button>
      )}
    </>
  )
}

export default DownloadProgressCard
