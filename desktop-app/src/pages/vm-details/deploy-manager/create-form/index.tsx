import { useState } from 'react'
import { FileArchive, GitBranch } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import type { deployT } from '@/types/vm'

import { useDeploy, useZipDeploy } from '@/hooks/use-deploy-manager'
import useVMStore from '@/store/vm'
import useUIStore from '@/store/ui'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import GitUploadFields from './git-upload-fields'
import ZipUploadField from './zip-upload-fields'

const formSchema = z.object({
  github_username: z.string().optional(),
  github_token: z.string().optional(),
  repo_url: z.string().optional(), // .url('Please enter a valid URL').min(1, 'Repository URL is required')
  port: z.coerce.number().int().min(1, 'Port must be greater than 0').max(65535, 'Port must be less than 65536'),
  start_command: z.string().optional(),
  description: z.string().min(1, 'Project description is required'),
  framework: z.enum(['nodejs', 'python', 'supabase', 'other'], {
    required_error: 'Please select a framework',
  }),
  file: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

type CreateFormProps = deployT & {
  onCreate: (applicationId: string) => void
}

function getRepoUrl({
  github_username,
  github_token,
  repo_url,
}: {
  github_username?: string
  github_token?: string
  repo_url: string
}) {
  let url = repo_url
  if (github_username && github_token) {
    url = `https://${github_token}@github.com/${github_username}/${repo_url?.split('/')?.pop()}`
  }

  return url.endsWith('.git') ? url : `${url}.git`
}

function CreateForm({ id, port, status, onCreate }: CreateFormProps) {
  const [uploadMethod, setUploadMethod] = useState<'git' | 'zip'>('git')
  const vm = useVMStore((s) => s.vms?.find((vm) => vm.id === id))

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repo_url: '',
      port: 3000,
      start_command: '',
      description: '',
      framework: 'nodejs',
      file: null,
    },
  })

  const updateModal = useUIStore((store) => store.update)

  const { mutate: zipDeploy, isPending: zipDeployPending } = useZipDeploy(id, port)
  const { mutate: deploy, isPending: deployPending } = useDeploy(id, port)

  const handleSubmit = (values: FormValues) => {
    if (status !== 'running') {
      return toast.warning('Server is not running', {
        description: 'Please start the Server before deploying an application',
      })
    }

    if (!vm?.ports?.vm?.some((port) => port.internal === Number(values.port))) {
      return toast.error('Internal port not found', {
        description: 'Please add the port in the network config',
      })
    }

    if (vm?.deployManager?.some((deploy) => deploy.port === Number(values.port))) {
      return toast.warning('Port already in use', {
        description: 'Please use a different port',
      })
    }

    if (vm?.deployManager?.some((deploy) => deploy.repo_url === values.repo_url)) {
      return toast.warning('Repository already in use', {
        description: 'Please use a different repository',
      })
    }

    if (values.github_username || values.github_token) {
      if (!values.github_username || !values.github_token) {
        return toast.warning(`Github ${!values.github_username ? 'username' : 'token'} is required`, {
          description: 'If you are using github for authentication',
        })
      }
    }

    const payload: any = {
      repo_url: getRepoUrl({
        github_username: values.github_username,
        github_token: values.github_token,
        repo_url: values.repo_url,
      }),
      port: Number(values.port),
      description: values.description,
      framework: values.framework,
      start_command: [],
      file: values.file,
    }

    if (values.start_command && values.start_command.trim() !== '') {
      payload.start_command.push(
        ...(values.start_command
          .match(/(?:[^\s"]+|"[^"]*")+/g)
          ?.map((arg) => (arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg)) ?? [])
      )
    }

    if (payload?.file) {
      const metadata = {
        port: Number(values.port),
      }
      payload.metadata_json = metadata

      zipDeploy(payload, {
        onSuccess: (res) => {
          onCreate(res.application_id)
          updateModal({ open: 'log-modal', data: { application_id: res.application_id, id } })
        },
      })
    } else {
      deploy(payload, {
        onSuccess: (res) => {
          onCreate(res.application_id)
          updateModal({ open: 'log-modal', data: { application_id: res.application_id, id } })
        },
      })
    }
  }

  const exposedPorts = vm?.ports?.vm?.map((p) => p.internal).filter((port) => ![3401, 6222].includes(port))
  const isPending = zipDeployPending || deployPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='space-y-2'>
          <FormLabel>Select Upload Method</FormLabel>
          <div className='inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground'>
            <button
              type='button'
              onClick={() => setUploadMethod('git')}
              className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                uploadMethod === 'git'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'hover:bg-muted-hover hover:text-foreground'
              }`}>
              <GitBranch className='mr-2 h-4 w-4' />
              Git Repository
            </button>
            <button
              type='button'
              onClick={() => setUploadMethod('zip')}
              className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                uploadMethod === 'zip'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'hover:bg-muted-hover hover:text-foreground'
              }`}>
              <FileArchive className='mr-2 h-4 w-4' />
              ZIP Upload
            </button>
          </div>
        </div>

        {uploadMethod === 'git' && <GitUploadFields control={form.control} />}

        {uploadMethod === 'zip' && <ZipUploadField control={form.control} setValue={form.setValue} />}

        <FormField
          control={form.control}
          name='port'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port (Internal)</FormLabel>
              <FormControl>
                <Select value={`${field.value}`} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select port' />
                  </SelectTrigger>
                  <SelectContent>
                    {exposedPorts.map((port) => (
                      <SelectItem key={`${port}`} value={`${port}`}>
                        {port}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Port to run your application on.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input placeholder='Brief summary of your project' {...field} />
              </FormControl>
              <FormDescription>This description helps identify your application in the dashboard.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='framework'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Framework</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select framework' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='nodejs'>Node.js</SelectItem>
                    <SelectItem value='python'>Python</SelectItem>
                    <SelectItem value='supabase'>Supabase</SelectItem>
                    <SelectItem value='mongodb + nodejs'>MongoDB + Node.js</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Select the framework used in this project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='start_command'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Command (Optional)</FormLabel>
              <FormControl>
                <Input placeholder='npm start' {...field} />
              </FormControl>
              <FormDescription>
                Custom start command (e.g. "npm start" or "node server.js"). Leave empty for auto-detection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? 'Deploying...' : 'Deploy Application'}
        </Button>
      </form>
    </Form>
  )
}

export default CreateForm
