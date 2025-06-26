import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener)
    return () => ipcRenderer.removeListener(channel, listener)
  },
  off: (channel: string, listenerRemover: () => void) => {
    listenerRemover()
  },
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },
  invoke: <T>(channel: string, ...args: any[]): Promise<T> => {
    return ipcRenderer.invoke(channel, ...args)
  },
})

contextBridge.exposeInMainWorld('electronAPI', {
  vmStart: (id: string, data: Record<string, any>) => ipcRenderer.invoke('vm-start', { id, ...data }),
  vmInput: (id: string, input: string) => ipcRenderer.send('vm-input', { id, input }),
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  isVMReady: (id: string) => ipcRenderer.invoke('is-vm-ready', id),
  vmKill: (id: string) => ipcRenderer.invoke('vm-kill', id),
  vmStop: (id: string) => ipcRenderer.invoke('vm-stop', id),
  killAllVms: () => ipcRenderer.invoke('kill-all-vms'),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
  selectFolder: () => ipcRenderer.invoke('dialog:select-folder'),
  googleAuth: () => ipcRenderer.invoke('auth:google'),
})

contextBridge.exposeInMainWorld('nodeRequire', require)
