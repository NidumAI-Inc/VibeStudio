import { create } from 'zustand'
import { root } from '@/services/end-points'
import useVMStore from '@/store/vm'
import { VM } from '@/types/vm'
import { toast } from 'sonner'

type ProgressEntry = {
  title: string
  progress: number
}

type DownloadQueueState = {
  queue: string[]
  progressMap: Record<string, ProgressEntry>
  addToQueue: (vm: VM, url: string) => Promise<void>
  removeFromQueue: (id: string) => void
}

const useDownloadQueue = create<DownloadQueueState>((set, get) => ({
  queue: [],
  progressMap: {},

  addToQueue: async (vm, url) => {
    const { id, name } = vm

    set((state) => {
      const updatedQueue = [...state.queue, id]
      const updatedProgress = {
        ...state.progressMap,
        [id]: { title: name, progress: 0 },
      }

      return {
        queue: updatedQueue,
        progressMap: updatedProgress,
      }
    })

    try {
      const finalUrl = `${root.localBackendUrl}/download?url=${encodeURIComponent(url)}`

      const res = await fetch(finalUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let lastProgress = 0

      while (true) {
        const { value, done } = (await reader?.read()) || {}
        if (done) break

        const chunk = decoder.decode(value)
        const events = chunk.split('\n\n')

        for (const line of events) {
          if (!line.startsWith('data: ')) continue

          try {
            const data = JSON.parse(line.slice(6))
            const progress = data?.progress ?? 0

            if (progress > lastProgress) {
              lastProgress = progress
              set((state) => ({
                progressMap: {
                  ...state.progressMap,
                  [id]: {
                    ...state.progressMap[id],
                    progress,
                  },
                },
              }))
            }
          } catch {
            // ignore malformed JSON
          }
        }
      }
      // Check if VM already exists in store before adding
      const currentVMs = useVMStore.getState().vms
      const existingVM = currentVMs.find(existingVm => existingVm.id === vm.id)
      
      if (existingVM) {
        // Update existing VM as downloaded
        console.log('Updating existing VM as downloaded:', vm.id)
        useVMStore.getState().updateVM(vm.id, {
          downloaded: true,
          runType: 'default',
          ports: {
            ...vm.ports,
            vm: vm.ports?.vm || [],
          },
        })
      } else {
        // Add new VM to store
        console.log('Adding new VM to store:', vm.id)
        useVMStore.getState().addVM({
          ...vm,
          downloaded: true,
          runType: 'default',
          ports: {
            ...vm.ports,
            vm: vm.ports?.vm || [],
          },
        })
      }

      toast.success(`${name} downloaded successfully`)
    } catch (err) {
      console.error('Download error:', err)
      toast.error(`❌ Download failed for ${name}`)
    } finally {
      get().removeFromQueue(id)
    }
  },

  removeFromQueue: (id) => {
    set((state) => {
      const { [id]: _, ...remaining } = state.progressMap
      const updatedQueue = state.queue.filter((vmId) => vmId !== id)

      // if (updatedQueue.length > 0) {
      //   console.log('⚙️ Remaining in queue:', updatedQueue)
      // } else {
      //   console.log('✅ Download queue is now empty')
      // }

      return {
        queue: updatedQueue,
        progressMap: remaining,
      }
    })
  },
}))

export default useDownloadQueue
