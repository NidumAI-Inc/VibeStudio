import { useEffect, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FolderOpen } from 'lucide-react'
import Editor from '@monaco-editor/react'
import ReactDiffViewer from 'react-diff-viewer-continued'
import { useCodeDumpUIStore } from '@/store/codeDumpUIStore'
import { WrittenAction } from '@/types/written-actions'
import { Skeleton } from '@/components/ui/skeleton'

const getLanguage = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'css':
    case 'scss':
      return 'css'
    case 'html':
      return 'html'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    default:
      return 'plaintext'
  }
}

interface Props {
  writtenActions?: WrittenAction[]
  instantRender?: boolean
  typed: Record<string, string>
  setTyped: React.Dispatch<React.SetStateAction<Record<string, string>>>
  typedSet: Set<string>
  setTypedSet: React.Dispatch<React.SetStateAction<Set<string>>>
}

const GeneratedCodeView = ({
  writtenActions = [],
  instantRender = false,
  typed,
  setTyped,
  typedSet,
  setTypedSet,
}: Props) => {
  const setShowCodeDump = useCodeDumpUIStore((s) => s.setShowCodeDump)
  const selectedActions = useCodeDumpUIStore((s) => s.selectedActions)

  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const actionsToRender = selectedActions && selectedActions.length > 0 ? selectedActions : writtenActions

  const files = useMemo(() => {
    const writeMap = new Map<string, string>()
    const editMap = new Map<string, { oldStr: string; newStr: string }[]>()

    for (const action of actionsToRender || []) {
      if (action.type === 'write' && action.path && action.content) {
        writeMap.set(action.path, (writeMap.get(action.path) || '') + action.content)
      } else if (action.type === 'edit' && action.path) {
        const list = editMap.get(action.path) || []
        list.push({
          oldStr: action.old_string || '',
          newStr: action.new_string || '',
        })
        editMap.set(action.path, list)
      }
    }

    return {
      writeFiles: Array.from(writeMap.entries()),
      editFiles: Array.from(editMap.entries()),
    }
  }, [actionsToRender])

  useEffect(() => {
    const queue = files.writeFiles.filter(([path]) => !typedSet.has(path))
    if (!queue.length) return

    if (instantRender) {
      const newTyped: Record<string, string> = {}
      const newSet = new Set<string>()
      for (const [path, code] of queue) {
        newTyped[path] = code
        newSet.add(path)
      }
      setTyped((prev) => ({ ...prev, ...newTyped }))
      setTypedSet((prev) => new Set([...prev, ...newSet]))
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      return
    }

    const alreadyTyping = Object.keys(typed).find((path) => !typedSet.has(path) && typed[path]?.length > 0)
    const updatedTypedSet = new Set(typedSet)

    if (alreadyTyping) {
      const code = queue.find(([p]) => p === alreadyTyping)?.[1]
      if (code) {
        setTyped((prev) => ({ ...prev, [alreadyTyping]: code }))
        updatedTypedSet.add(alreadyTyping)
        setTypedSet(new Set(updatedTypedSet))
      }
    }

    const filteredQueue = queue.filter(([path]) => !updatedTypedSet.has(path))
    let i = 0

    const typeNext = () => {
      if (i >= filteredQueue.length) return
      const [path, code] = filteredQueue[i]
      let j = 0

      const typing = setInterval(() => {
        j += 120
        setTyped((prev) => ({
          ...prev,
          [path]: code.slice(0, j + 4),
        }))
        j++
        if (j > code.length) {
          clearInterval(typing)
          setTypedSet((prev) => new Set([...prev, path]))
          i++
          setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
            typeNext()
          }, 150)
        }
      }, 5)
    }

    typeNext()
  }, [files.writeFiles, instantRender])

  const isCodeVisible = files.editFiles.length > 0 || files.writeFiles.length > 0

  return (
    <div ref={containerRef} className='p-6 text-black h-full overflow-auto bg-gray-50 space-y-6'>
      <div className='flex justify-start mb-4'>
        <Button
          variant='outline'
          size='sm'
          className='text-blue-600 border-blue-300 hover:bg-blue-50'
          onClick={() => setShowCodeDump(false)}>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
      </div>

      {!isCodeVisible ? (
        <CodeDumpSkeleton />
      ) : (
        <>
          {files.writeFiles.map(([path, fullCode]) => {
            const language = getLanguage(path)
            const content = typed[path]
            const lineCount = fullCode.split('\n').length
            const rowHeight = 20
            const minHeight = 300
            const maxHeight = 1200
            const heightPx = Math.min(maxHeight, Math.max(minHeight, lineCount * rowHeight))

            return (
              <Card key={path} className='flex flex-col bg-white border-blue-200 rounded-md'>
                <CardHeader className='shrink-0 bg-blue-50 border-b border-blue-200 rounded-t-md px-4 py-3'>
                  <CardTitle className='flex flex-row gap-2 items-center text-sm font-mono text-blue-600'>
                    <FolderOpen size={18} />
                    <span>{path}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col p-0 rounded-b-md'>
                  <div className='px-4 py-2 bg-gray-50 border-b border-blue-200'>
                    <span className='text-xs text-gray-600 uppercase tracking-wider'>{language}</span>
                  </div>
                  <div style={{ height: `${heightPx}px`, overflow: 'hidden' }}>
                    {content !== undefined ? (
                      <Editor
                        height={`${heightPx}px`}
                        language={language}
                        value={content}
                        options={{
                          readOnly: true,
                          automaticLayout: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          wordWrap: 'on',
                          fontSize: 14,
                        }}
                      />
                    ) : (
                      <Skeleton className='h-[300px] w-full rounded-none' />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {files.editFiles.map(([path, diffs], idx) => (
            <Card key={`edit-${idx}`} className='bg-white border-blue-200 rounded-md'>
              <CardHeader className='bg-blue-50 border-b border-blue-200 rounded-t-md px-4 py-3'>
                <CardTitle className='flex flex-row gap-2 items-center text-sm font-mono text-yellow-600'>
                  <FolderOpen size={18} />
                  <span>{path}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 overflow-auto bg-gray-50 rounded-b-sm'>
                {diffs.map((diff, i) => (
                  <div key={i} className='mb-6'>
                    <ReactDiffViewer
                      oldValue={diff.oldStr}
                      newValue={diff.newStr}
                      splitView={false}
                      showDiffOnly
                      styles={{
                        variables: {
                          light: {
                            addedBackground: '#e6ffed',
                            removedBackground: '#ffeef0',
                            addedGutterBackground: '#cdffd8',
                            removedGutterBackground: '#ffdce0',
                          },
                        },
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default GeneratedCodeView

const CodeDumpSkeleton = () => {
  return (
    <div className='space-y-6 p-6'>
      {[1, 2].map((i) => (
        <div key={i} className='bg-white border border-blue-200 rounded-md overflow-hidden'>
          <div className='bg-blue-50 border-b border-blue-200 px-4 py-3'>
            <Skeleton className='h-4 w-1/3 rounded' />
          </div>
          <div className='bg-gray-50 border-b border-blue-200 px-4 py-2'>
            <Skeleton className='h-3 w-20 rounded' />
          </div>
          <Skeleton className='h-64 w-full rounded-none' />
        </div>
      ))}
    </div>
  )
}
