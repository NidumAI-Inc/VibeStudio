import { useEffect, useState } from 'react'
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { vscodeLight } from '@uiw/codemirror-theme-vscode'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { Save, X } from 'lucide-react'

import { javascript } from '@codemirror/lang-javascript'
import { markdown } from '@codemirror/lang-markdown'
import { python } from '@codemirror/lang-python'
import { json } from '@codemirror/lang-json'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'

import { useTheme } from 'next-themes'
import { Button } from '../ui/button'

interface CodeEditorProps extends ReactCodeMirrorProps {
  fileName: string
  content: string
  onSave: (content: string) => void
}

const CodeEditor = ({ fileName, content: initialContent, onSave, ...props }: CodeEditorProps) => {
  const [content, setContent] = useState(initialContent)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const getLanguageExtension = (lang: string) => {
    const languageMap: Record<string, any> = {
      javascript: javascript({ jsx: true }),
      js: javascript({ jsx: true }),
      jsx: javascript({ jsx: true }),
      typescript: javascript({ jsx: true, typescript: true }),
      ts: javascript({ jsx: true, typescript: true }),
      tsx: javascript({ jsx: true, typescript: true }),
      html: html(),
      css: css(),
      python: python(),
      py: python(),
      markdown: markdown(),
      md: markdown(),
      json: json(),
    }

    return languageMap[lang.toLowerCase()] || javascript()
  }

  const isMac = (() => {
    if (typeof navigator === 'undefined') return false
    const uaPlatform = (navigator as any).userAgentData?.platform
    if (uaPlatform) return uaPlatform.toLowerCase().includes('mac')
    if (navigator.platform) return navigator.platform.toLowerCase().includes('mac')
    return false
  })()

  const dirty = content !== initialContent

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSaveShortcut = (isMac && e.metaKey) || (!isMac && e.ctrlKey)
      if (isSaveShortcut && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (dirty) onSave(content)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, dirty, onSave, isMac])

  return (
    <div className='relative h-full'>
      <div className='relative h-full'>
        <CodeMirror
          className='h-full'
          theme={resolvedTheme === 'dark' ? dracula : vscodeLight}
          extensions={[getLanguageExtension(fileName.split('.').pop() || '')]}
          value={content}
          onChange={setContent}
          {...props}
        />
        
        {dirty && (
          <div className='absolute top-3 right-3 flex space-x-2 z-[9999]'>
            <Button
              size='sm'
              variant='ghost'
              className='flex items-center space-x-1 h-8 bg-white/95 hover:bg-gray-100/95 text-gray-800
                         dark:bg-gray-900/95 dark:hover:bg-gray-800/95 dark:text-white font-medium px-3 py-2 rounded-md shadow-lg border backdrop-blur-sm'
              onClick={() => setContent(initialContent)}>
              <X className='w-4 h-4' />
              <span>Cancel</span>
            </Button>
            <Button
              size='sm'
              variant='secondary'
              className='flex items-center space-x-1 h-8 bg-blue-600/95 hover:bg-blue-700/95 text-white
                         font-medium px-3 py-2 rounded-md shadow-lg border backdrop-blur-sm'
              onClick={() => onSave(content)}>
              <Save className='w-4 h-4' />
              <span>Save ({isMac ? '⌘' : 'Ctrl'}+S)</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor
