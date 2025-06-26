import { Card } from '@/components/ui/card'
import { useState, ReactNode } from 'react'
import { Terminal, Copy, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string

interface CurlBlockProps {
  title: string
  method: HttpMethod
  url: string
  curl: string
  js?: string
  python?: string
  description?: string
  icon?: ReactNode
}

export function CurlBlock({ title, method, url, curl, js, python, description, icon }: CurlBlockProps) {
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState<'curl' | 'js' | 'python'>('curl')

  const getCode = () => {
    if (language === 'js') return js
    if (language === 'python') return python
    return curl
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCode() || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const getMethodColor = (method: HttpMethod) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'
      case 'POST':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
      case 'PUT':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
      case 'DELETE':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <Card className='group transition-all duration-300 hover:shadow-md border bg-card text-card-foreground'>
      <div className='p-6'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-muted text-muted-foreground'>{icon}</div>
            <div>
              <h4 className='text-lg font-semibold'>{title}</h4>
              {description && <p className='text-sm text-muted-foreground mt-1'>{description}</p>}
            </div>
          </div>
          <Terminal className='w-5 h-5 text-muted-foreground' />
        </div>

        {/* Meta */}
        <div className='flex items-center gap-3 mb-4'>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMethodColor(method)}`}>
            {method.toUpperCase()}
          </span>
          <code className='text-sm px-3 py-1 rounded-md font-mono bg-muted text-muted-foreground'>{url}</code>
        </div>

        {/* Tabs */}
        <div className='w-40 mb-2'>
          <Select value={language} onValueChange={(v) => setLanguage(v as 'curl' | 'js' | 'python')}>
            <SelectTrigger className='h-8'>
              <SelectValue placeholder='Language' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='curl'>cURL</SelectItem>
              {js && <SelectItem value='js'>JavaScript</SelectItem>}
              {python && <SelectItem value='python'>Python</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        {/* Code Block */}
        <div className='relative'>
          <div className='absolute top-3 right-3 z-10'>
            <button
              onClick={copyToClipboard}
              className='p-2 rounded-lg bg-background/80 hover:bg-muted transition-colors backdrop-blur-sm border border-border'
              title='Copy to clipboard'>
              {copied ? (
                <Check className='w-4 h-4 text-green-400' />
              ) : (
                <Copy className='w-4 h-4 text-muted-foreground' />
              )}
            </button>
          </div>
          <pre className='bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-border'>
            <code>{getCode()}</code>
          </pre>
        </div>
      </div>
    </Card>
  )
}
