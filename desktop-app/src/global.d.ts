export {}

type vmStartT = {
  diskName: string
  cpuCore: number
  memory: number
  ports: {
    internal: number
    exposed: number
  }[]
}

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => () => void
      off: (channel: string, listenerRemover: () => void) => void
      send: (channel: string, ...args: any[]) => void
      invoke: <T>(channel: string, ...args: any[]) => Promise<T>
    }

    electronAPI: {
      vmStart(id: string, input: vmStartT): Promise<number>
      vmInput(id: string, input: string): void
      invoke: (channel: string, ...args: any[]) => Promise<any>
      isVMReady(id: string): Promise<boolean>
      vmKill(id: string): Promise<boolean>
      vmStop(id: string): Promise<void>
      killAllVms(): Promise<boolean>
      openExternal?: (url: string) => void
      selectFolder: () => Promise<string | null>
      googleAuth: () => Promise<{ token: string }>
      // Shell terminal APIs
      shellStart(id: string): Promise<boolean>
      shellInput(id: string, input: string): void
      shellResize(id: string, cols: number, rows: number): Promise<void>
      shellKill(id: string): Promise<boolean>
    }
  }
}
