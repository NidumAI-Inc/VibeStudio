import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bot, Eye, EyeOff, Lock, RefreshCcw } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { toast } from 'sonner'

type ApiKeySource = 'manual' | 'auto' | 'ollama'

interface AnthropicConfigCardProps {
  apiKey: string
  showPassword: boolean
  onInputChange: (value: string) => void
  onToggleVisibility: () => void
}

const AnthropicConfigCard = ({ apiKey, showPassword, onInputChange, onToggleVisibility }: AnthropicConfigCardProps) => {
  const [apiKeySource, setApiKeySource] = useState<ApiKeySource>('manual')

  const handleFetchAnthropicKey = async () => {
    toast('Please contact info@aivf.io')
  }
  return (
    <Card className='bg-white border-gray-200'>
      <CardHeader className='pb-4'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
            <Bot className='w-5 h-5 text-blue-500' />
          </div>
          <div>
            <CardTitle className='text-black text-xl'>LLM Providers</CardTitle>
            <CardDescription className='text-gray-600'>
              Connect your Anthropic API key to enable AI-powered conversations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='api-key-source' className='text-black font-medium'>
            Key Source
          </Label>
          <Select value={apiKeySource} onValueChange={(value: ApiKeySource) => setApiKeySource(value)}>
            <SelectTrigger id='api-key-source' className='w-full h-12 bg-white border-gray-300 text-black'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='manual'>Anthropic</SelectItem>
              <SelectItem value='auto'>Nidum LLM</SelectItem>
              <SelectItem value='ollama' disabled>
                Ollama (coming soon)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {apiKeySource === 'manual' && (
          <div>
            <Label htmlFor='anthropic-key' className='text-black font-medium mb-2 block'>
              API Key
            </Label>
            <div className='relative'>
              <Input
                id='anthropic-key'
                type={showPassword ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder='sk-ant-...'
                className='bg-white border-gray-300 text-black placeholder-gray-400 h-12 pr-12 focus:ring-2 focus:ring-blue-500'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-12 px-3 hover:bg-gray-100'
                onClick={onToggleVisibility}>
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-600' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-600' />
                )}
              </Button>
            </div>
            <p className='text-sm text-gray-500 mt-2'>
              Get your API key from
              <a
                href='https://console.anthropic.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:text-blue-600 underline'>
                Anthropic Console
              </a>
            </p>
          </div>
        )}

        {apiKeySource === 'auto' && (
          <div className='flex flex-col items-start gap-2'>
            <Label className='text-black font-medium mb-2 flex items-center gap-2'>
              Auto-generated API Key <Lock className='w-4 h-4 text-gray-500' />
            </Label>
            <Button
              variant='secondary'
              className='bg-blue-500 text-white hover:bg-blue-600 px-4 h-12'
              onClick={handleFetchAnthropicKey}>
              <RefreshCcw className='w-4 h-4 mr-2' />
              Fetch API Key
            </Button>
            <p className='text-sm text-gray-500'>The key will be securely fetched and used automatically.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AnthropicConfigCard
