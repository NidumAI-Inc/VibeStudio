import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

import useVMStore from '@/store/vm'
import useDownloadQueue from '@/hooks/use-download-queue'
import { vmTypes, ports, resourceConfigs } from '@/pages/create-vm/constantans'
import { VM } from '@/types/vm'

type SetupPhase = 'checking' | 'downloading' | 'complete' | 'error'

export function useVibeAutoSetup() {
  const [setupPhase, setSetupPhase] = useState<SetupPhase>('checking')
  const [setupProgress, setSetupProgress] = useState(0)
  const [vibeVmId, setVibeVmId] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const vms = useVMStore((s) => s.vms)
  const addToQueue = useDownloadQueue((s) => s.addToQueue)
  const downloadProgress = useDownloadQueue((s) => s.progressMap)
  
  // Initial setup check and VM creation
  useEffect(() => {
    const checkAndSetupVibe = async () => {
      try {
        // Check if VibeCoding VM already exists - prioritize downloaded ones
        const vibeVMs = vms.filter(vm => vm.type === 'VibeCoding')
        const downloadedVibeVM = vibeVMs.find(vm => vm.downloaded)
        const undownloadedVibeVM = vibeVMs.find(vm => !vm.downloaded)
        
        // Clean up duplicate VMs if multiple exist
        if (vibeVMs.length > 1) {
          console.log('Found multiple VibeCoding VMs, cleaning up duplicates...')
          const vmToKeep = downloadedVibeVM || undownloadedVibeVM
          const duplicates = vibeVMs.filter(vm => vm.id !== vmToKeep?.id)
          duplicates.forEach(duplicate => {
            console.log('Removing duplicate VM:', duplicate.id)
            useVMStore.getState().removeVM(duplicate.id)
          })
        }
        
        if (downloadedVibeVM) {
          // VM exists and is downloaded, redirect to its details page
          console.log('Found existing downloaded VibeCoding VM:', downloadedVibeVM.id)
          setVibeVmId(downloadedVibeVM.id)
          setSetupPhase('complete')
          setTimeout(() => {
            navigate(`/vm/${downloadedVibeVM.id}`)
          }, 500)
          return
        } else if (undownloadedVibeVM) {
          // VM exists but not downloaded, resume download
          console.log('Found existing undownloaded VibeCoding VM, resuming:', undownloadedVibeVM.id)
          setVibeVmId(undownloadedVibeVM.id)
          setSetupPhase('downloading')
          return
        }
        
        // Create new VibeCoding VM
        const vibeConfig = vmTypes[0] // VibeCoding is the only option now
        const vmId = nanoid()
        
        const newVM: VM = {
          id: vmId,
          name: 'VibeStudio Server',
          type: 'VibeCoding',
          runType: 'default',
          status: 'idle',
          projectType: null,
          createdAt: new Date().toISOString(),
          lastStartedAt: '',
          needRestart: false,
          os: 'VibeStudio Linux',
          version: '3.21.0',
          tags: ['vibestudio', 'server'],
          additional: {},
          diskUrl: vibeConfig.url,
          downloaded: false,
          ipAddress: '',
          basePath: '/',
          resourceConfig: resourceConfigs.standard, // Use standard by default
          ports: ports.VibeCoding,
          configFilePath: '',
        }
        
        // Add VM to store first (as not downloaded)
        useVMStore.getState().addVM(newVM)
        console.log('Created new VibeCoding VM:', vmId)
        
        setVibeVmId(vmId)
        setSetupPhase('downloading')
        
        // Start download
        await addToQueue(newVM, vibeConfig.url)
        
      } catch (error) {
        console.error('VibeCoding auto-setup failed:', error)
        setSetupPhase('error')
      }
    }
    
    checkAndSetupVibe()
  }, [])
  
  // Handle download errors by checking if download failed
  useEffect(() => {
    if (vibeVmId && setupPhase === 'downloading') {
      // Check if download was removed from queue but VM wasn't added (indicates error)
      if (!downloadProgress[vibeVmId]) {
        const vm = vms.find(v => v.id === vibeVmId)
        if (!vm || !vm.downloaded) {
          console.log('Download failed - VM not found or not downloaded')
          setSetupPhase('error')
        }
      }
    }
  }, [downloadProgress, vibeVmId, setupPhase, vms])
  
  // Monitor download progress
  useEffect(() => {
    if (vibeVmId && downloadProgress[vibeVmId]) {
      const progress = downloadProgress[vibeVmId].progress
      setSetupProgress(progress)
      
      if (progress >= 100) {
        console.log('Download progress reached 100%, setting complete phase')
        setSetupPhase('complete')
        // Redirect to VM details after download completes
        setTimeout(() => {
          console.log('Redirecting to VM details:', vibeVmId)
          navigate(`/vm/${vibeVmId}`)
        }, 1000)
      }
    }
  }, [downloadProgress, vibeVmId, navigate])
  
  // Check if VM was added to store (download completed) - this is the main check
  useEffect(() => {
    if (vibeVmId) {
      const vm = vms.find(v => v.id === vibeVmId && v.downloaded)
      if (vm) {
        console.log('VM found in store and downloaded, redirecting:', vm)
        setSetupPhase('complete')
        setTimeout(() => {
          navigate(`/vm/${vibeVmId}`)
        }, 500)
      }
    }
  }, [vms, vibeVmId, navigate])
  
  // Debug: Log when download progress is removed (download finished)
  useEffect(() => {
    if (vibeVmId && !downloadProgress[vibeVmId] && setupPhase === 'downloading') {
      console.log('Download progress removed, checking if VM exists...')
      const vm = vms.find(v => v.id === vibeVmId)
      console.log('VM in store:', vm)
      if (vm?.downloaded) {
        console.log('VM is downloaded, redirecting...')
        setSetupPhase('complete')
        setTimeout(() => {
          navigate(`/vm/${vibeVmId}`)
        }, 500)
      }
    }
  }, [downloadProgress, vibeVmId, setupPhase, vms, navigate])
  
  return {
    setupPhase,
    setupProgress,
    vibeVmId,
  }
}