import { create } from 'zustand'
import { root } from '@/services/end-points'

type Downloads = {
  [id: string]: {
    title?: string
    progress: number
  }
}

type DownloadParams = {
  id: string
  url: string
  title?: string
  onSuccess?: () => void
}

type DownloadStore = {
  downloads: Downloads
  downloadDisk: (params: DownloadParams) => Promise<void>
}

const useDownloadsStore = create<DownloadStore>((set) => ({
  downloads: {},

  downloadDisk: async ({ id, url, title, onSuccess = () => {} }) => {
    try {
      set((state) => ({
        downloads: {
          ...state.downloads,
          [id]: {
            title,
            progress: 0,
          },
        },
      }))
      // if (title?.toLowerCase()?.includes('ollama')) {
      //   console.log(`[Download] Starting Ollama:`, { id, url, title })
      // }

      const response = await fetch(`${root.localBackendUrl}/download?url=${encodeURIComponent(url)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let oldProgress = 0

      while (true) {
        const { value, done } = (await reader?.read()) || {}
        if (done) {
          set((state) => {
            const newDownloads = { ...state.downloads }
            delete newDownloads[id]
            return {
              downloads: newDownloads,
            }
          })
          onSuccess()
          break
        }

        const chunk = decoder?.decode(value)
        const lines = chunk?.split('\n\n')

        lines?.forEach((line) => {
          if (line?.startsWith('data: ')) {
            let data = null
            try {
              data = JSON?.parse(line?.slice(6))
            } catch (error) {
              // console.log(error)
            }

            if (data && data?.progress > oldProgress) {
              set((state) => ({
                downloads: {
                  ...state.downloads,
                  [id]: {
                    ...state.downloads[id],
                    progress: data?.progress || 0,
                  },
                },
              }))

              oldProgress = data?.progress
            }
          }
        })
      }
    } catch (err) {
      set((state) => {
        const newDownloads = { ...state.downloads }
        delete newDownloads[id]
        return {
          downloads: newDownloads,
        }
      })
    }
  },
}))

export default useDownloadsStore
