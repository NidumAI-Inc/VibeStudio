import { useEffect, useRef, useState } from 'react'
import { Database, Code, Box, Server, Layers, AudioLines, Cpu, MemoryStick, HelpCircle, Gauge } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'

import { steps, vmTypes, resourceConfigs, resourseT, ports, configPath } from './constantans'
import type { VM, VMType, WebProjectType } from '@/types/vm'
import useDownloadQueue from '@/hooks/use-download-queue'
import useVMStore from '@/store/vm'
import { cn } from '@/lib/utils'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TagsInput } from '@/components/ui/tags-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import HomeWrapper from '@/components/home-wrapper'
import useVMNamesStore from '@/store/vm-names'
import Ollama from '@/assets/svg/ollama'
import Supabase from '@/assets/svg/supabase'
import Python from '@/assets/svg/python'
import NodeJS from '@/assets/svg/nodejs'
import MongoDB from '@/assets/svg/mongo-db'
import Npm from '@/assets/svg/npm'
import VibeCodingIcon from '@/assets/imgs/vibecoding.png'

const renderIcon = (iconName: string, colorClass: string) => {
  const iconProps = {
    className: `mr-3 h-6 w-6 ${colorClass}`,
  }

  switch (iconName) {
    case 'Database':
      return <Database {...iconProps} />
    case 'Code':
      return <Code {...iconProps} />
    case 'Leaf':
      return <Layers {...iconProps} className='h-8 w-8 mr-3 text-red-500' />
    case 'Server':
      return <Server {...iconProps} />
    case 'Ollama':
      return <Ollama {...iconProps} className='h-8 w-8 mr-2' />
    case 'Supabase':
      return <Supabase {...iconProps} className='h-6 w-6 mr-3.5' />
    case 'Python':
      return <Python {...iconProps} className='h-4 w-4 mr-5' />
    case 'NodeJs':
      return <NodeJS {...iconProps} className='h-8 w-8 ml-1 mr-3.5' />
    case 'TTS':
      return <AudioLines {...iconProps} className='h-6 w-6 mr-2 ml-1' />
    case 'MongoDB':
      return <MongoDB {...iconProps} className='h-6 w-6 ml-1 mr-2' />
    case 'Npm':
      return <Npm {...iconProps} className='h-12 w-12 mr-1 ' />
    case 'VibeCoding':
      return <img src={VibeCodingIcon} {...iconProps} className='h-5 w-7 mr-2 ' />

    default:
      return null
  }
}

type vmDataT = {
  id: string
  name: string
  type: VMType
  resourceConfig: string
  resources: resourseT
  hostWebProject: boolean
  projectType: WebProjectType
  importMethod: string
  gitUrl: string
  tags: string[]
}

function CreateVm() {
  const [currentStep, setCurrentStep] = useState(0)
  const tagWrapperRef = useRef<HTMLInputElement>(null)
  const [tagInputValue, setTagInputValue] = useState('')

  const [vmData, setVmData] = useState<vmDataT>({
    id: nanoid(),
    name: '',
    type: 'VibeCoding',
    resourceConfig: 'starter',
    resources: resourceConfigs.starter,
    hostWebProject: false,
    projectType: 'reactjs',
    importMethod: 'none',
    gitUrl: '',
    tags: [],
  })

  const navigate = useNavigate()

  const vms = useVMStore((s) => s.vms)
  const addToQueue = useDownloadQueue((s) => s.addToQueue)
  const updateName = useVMNamesStore((s) => s.updateName)

  function onClose() {
    navigate('/')
  }

  const handleChange = (field: string, value: any) => {
    if (field === 'resourceConfig') {
      setVmData((prev) => ({
        ...prev,
        resourceConfig: value,
        resources: resourceConfigs[value as keyof typeof resourceConfigs],
      }))
    } else {
      setVmData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleCreateVM = async () => {
    const { id, name, type, projectType, tags, resources, ...additional } = vmData

    const diskUrl = vmTypes.find((vm) => vm.id === type)?.url || ''

    const newVm: VM = {
      id,
      name,
      type,
      tags,
      diskUrl,
      additional,
      projectType,
      runType: 'default',
      os: 'NativeNode Linux',
      status: 'idle',
      version: '3.21.0',
      createdAt: new Date().toISOString(),
      downloaded: true,
      ipAddress: '',
      basePath: '/',
      resourceConfig: resources,
      ports: ports[type] ?? { glance: undefined, fs_api: undefined, vm: [] },

      lastStartedAt: '',
      needRestart: false,
      configFilePath: configPath[type] || '',
    }


    addToQueue(newVm, diskUrl)
    updateName(id, name)
    navigate('/')
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return vmData.name.trim() !== ''
      default:
        return true
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 0) {
        const alreadyAvailable = vms.find((vm) => vm.type === vmData.type)
        if (alreadyAvailable) {
          toast.error('Server of this type is already available', {
            description: 'Support for creating multiple VMs is coming soon.',
          })
          return
        }
        if (vmData.tags.length === 0) {
          toast.error('Tags are required', {
            description: 'Please add at least one tag before continuing.',
          })
          return
        }
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <HomeWrapper>
      <div className='py-4'>
        <Button variant='ghost' onClick={() => navigate('/')} className='mb-4'>
          &larr; Back to dashboard
        </Button>

        <Card className='w-full max-w-3xl mx-auto border-border'>
          <CardHeader>
            <CardTitle className='text-2xl'>Create A New App Server</CardTitle>
          </CardHeader>

          <CardContent>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                {steps.map((step, index) => (
                  <div key={step.id} className='flex items-center'>
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                        index <= currentStep
                          ? 'bg-primary text-white dark:bg-white dark:text-black'
                          : 'bg-muted text-muted-foreground'
                      )}>
                      {index + 1}
                    </div>

                    <span
                      className={cn(
                        'ml-2 hidden sm:block transition-colors',
                        index <= currentStep ? 'text-foreground dark:text-white' : 'text-muted-foreground'
                      )}>
                      {step.label}
                    </span>

                    {index < steps.length - 1 && <div className='mx-2 h-px w-8 bg-muted dark:bg-white/60' />}
                  </div>
                ))}
              </div>
            </div>

            {currentStep === 0 && (
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='vm-name'>App Server Name</Label>
                  <Input
                    id='vm-name'
                    value={vmData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder='My Awesome Server'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='vm-tags' className='text-sm font-medium text-foreground dark:text-white'>
                    Server Tags
                  </Label>

                  <div ref={tagWrapperRef}>
                    <TagsInput
                      id='vm-tags'
                      maxItems={5}
                      value={vmData.tags}
                      onValueChange={(e) => handleChange('tags', e)}
                      inputValue={tagInputValue}
                      onInputChange={setTagInputValue}
                      placeholder='Tags list...'
                      className={cn(
                        'w-full rounded-md border px-3 py-2 text-sm shadow-sm transition',
                        'bg-white text-black placeholder:text-gray-400',
                        'border-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        'dark:bg-muted dark:text-white dark:placeholder:text-gray-500 dark:border-muted/40'
                      )}
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <Label>App Servers Type</Label>
                  <RadioGroup
                    value={vmData.type}
                    onValueChange={(value) => handleChange('type', value)}
                    className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    {vmTypes.map((vmType, i) => {
                      const isSelected = vmData.type === vmType.value
                      const isDisabled = i > 6

                      return (
                        <Label
                          key={vmType.id}
                          htmlFor={`type-${vmType.id}`}
                          className={cn(
                            'flex cursor-pointer items-center rounded-lg border p-4 transition',
                            isSelected
                              ? 'border-primary ring-1 ring-primary dark:border-white dark:ring-white/20'
                              : 'border-border dark:border-border',
                            isDisabled && 'bg-muted/30 cursor-not-allowed'
                          )}>
                          <RadioGroupItem
                            value={vmType.value}
                            id={`type-${vmType.id}`}
                            className='sr-only'
                            disabled={isDisabled}
                          />

                          {renderIcon(vmType.icon, vmType.iconColor)}

                          <div>
                            <p className='block font-medium text-foreground dark:text-white'>{vmType.title}</p>
                            <p className='text-sm text-muted-foreground dark:text-white/70'>{vmType.description}</p>
                            {isDisabled && (
                              <p className='text-sm text-muted-foreground/50 dark:text-white/30'>(Coming Soon)</p>
                            )}
                          </div>
                        </Label>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className='space-y-6'>
                {false ? (
                  <div className='rounded-xl border border-border p-6 shadow-sm bg-muted/5 dark:bg-muted/10 transition-all'>
                    <div className='flex justify-center items-center mb-4'>
                      <div className='mb-4'>
                        <h3 className='text-xl flex justify-center font-semibold text-foreground dark:text-white leading-tight'>
                          <Gauge className='h-6 w-6 text-primary dark:text-white mr-2' />
                          Adaptive (Local Dynamic) Plan
                        </h3>
                        <p className='text-sm text-muted-foreground dark:text-white/70 mt-1'>
                          Automatically adjusts performance based on real-time demand.
                        </p>
                      </div>
                    </div>

                    <div className='space-y-4 mt-4'>
                      <div className='flex items-start gap-3'>
                        <Cpu className='h-5 w-5 mt-0.5 text-primary dark:text-white' />
                        <div>
                          <p className='font-medium text-foreground dark:text-white'>Dynamic CPU Scaling</p>
                          <p className='text-sm text-muted-foreground dark:text-white/70'>
                            Uses between <strong>2</strong> and <strong>all available cores</strong> depending on
                            current load.
                          </p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <MemoryStick className='h-5 w-5 mt-0.5 text-primary dark:text-white' />
                        <div>
                          <p className='font-medium text-foreground dark:text-white'>Adaptive Memory Allocation</p>
                          <p className='text-sm text-muted-foreground dark:text-white/70'>
                            Allocates RAM dynamically based on actual app usage patterns.
                          </p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <HelpCircle className='h-5 w-5 mt-0.5 text-primary dark:text-white' />
                        <div>
                          <p className='font-medium text-foreground dark:text-white'>Best For</p>
                          <p className='text-sm text-muted-foreground dark:text-white/70'>
                            Apps with <strong>variable or unpredictable workloads</strong>, like inference or data
                            streaming.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {Object.entries(resourceConfigs).map(([key, config]) => {
                      const isSelected = vmData.resourceConfig === key
                      const Icon = config.icon

                      return (
                        <Label
                          key={key}
                          htmlFor={`config-${key}`}
                          className={cn(
                            'flex flex-col items-stretch cursor-pointer rounded-lg border p-4 transition-colors',
                            isSelected
                              ? 'border-primary ring-1 ring-primary dark:border-white dark:ring-white/20'
                              : 'border-border dark:border-white/10 hover:bg-muted/10 dark:hover:bg-white/5'
                          )}>
                          <RadioGroup
                            value={vmData.resourceConfig}
                            onValueChange={(value) => handleChange('resourceConfig', value)}>
                            <RadioGroupItem value={key} id={`config-${key}`} className='sr-only' />
                          </RadioGroup>

                          <div className='flex items-center justify-between mb-2'>
                            <span className='font-medium text-foreground dark:text-white flex items-center gap-2'>
                              <Icon className='h-5 w-5 text-primary dark:text-white' />
                              {config.label}
                            </span>
                          </div>

                          <div className='space-y-1 text-sm text-muted-foreground dark:text-white/70'>
                            <p>{config.description}</p>
                            <ul className='mt-2'>
                              <li>CPU: {config.cpu} Cores</li>
                              <li>RAM: {config.ram} GB</li>
                            </ul>
                          </div>
                        </Label>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium'>Server Configuration Summary</h3>

                <div className='rounded-lg border border-border p-4'>
                  <dl className='divide-y divide-border'>
                    <div className='grid grid-cols-3 gap-4 py-3'>
                      <dt className='text-sm font-medium text-muted-foreground'>Server Name</dt>
                      <dd className='col-span-2 text-sm'>{vmData.name}</dd>
                    </div>
                    <div className='grid grid-cols-3 gap-4 py-3'>
                      <dt className='text-sm font-medium text-muted-foreground'>Server Type</dt>
                      <dd className='col-span-2 text-sm capitalize'>{vmData.type}</dd>
                    </div>
                    <div className='grid grid-cols-3 gap-4 py-3'>
                      <dt className='text-sm font-medium text-muted-foreground'>Resources</dt>
                      <dd className='col-span-2 text-sm'>
                        {false ? (
                          <>
                            <strong>CPU :</strong> Uses processing power as required
                            <br />
                            <strong>RAM :</strong> Allocates memory based on application needs
                          </>
                        ) : (
                          <>
                            {vmData.resources.cpu} CPU Cores, {vmData.resources.ram} GB RAM
                            <div className='mt-1 text-xs text-muted-foreground'>
                              {resourceConfigs[vmData.resourceConfig as keyof typeof resourceConfigs].description}
                            </div>
                          </>
                        )}
                      </dd>
                    </div>

                    <div className='grid grid-cols-3 gap-4 py-3'>
                      <dt className='text-sm font-medium text-muted-foreground'>Web Project</dt>
                      <dd className='col-span-2 text-sm'>
                        {vmData.hostWebProject
                          ? `${vmData.projectType.toUpperCase()} (${
                              vmData.importMethod === 'none'
                                ? 'No import'
                                : vmData.importMethod === 'folder'
                                ? 'Local folder import'
                                : 'GitHub import'
                            })`
                          : 'No web project'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className='rounded-lg bg-muted p-4'>
                  <div className='flex items-center'>
                    <Box className='h-8 w-8 text-primary' />
                    <div className='ml-3'>
                      <h4 className='text-sm font-medium'>Ready to create your App Server?</h4>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Review the configuration above and click "Create A Server" to proceed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className='flex justify-between'>
            <Button variant='ghost' onClick={currentStep === 0 ? onClose : prevStep}>
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>

            <Button
              onClick={currentStep === steps.length - 1 ? handleCreateVM : nextStep}
              disabled={!validateCurrentStep()}
              className={currentStep === steps.length - 1 ? 'bg-primary hover:bg-primary/90' : ''}>
              {currentStep === steps.length - 1 ? 'Create An App Server' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </HomeWrapper>
  )
}

export default CreateVm
