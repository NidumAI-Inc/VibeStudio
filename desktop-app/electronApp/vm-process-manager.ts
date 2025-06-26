import { BrowserWindow, ipcMain } from 'electron'
import { spawn } from 'node:child_process'
import { log } from 'electron-log'
import path from 'node:path'

interface VMProcess {
  process: ReturnType<typeof spawn>
  id: string
}

interface VMStartOptions {
  id: string
  diskName: string
  cpuCore: number
  memory: number
  ports: {
    internal: number
    exposed: number
  }[]
}

const vmProcesses: Map<string, VMProcess> = new Map()

function vmProcessManager(win: BrowserWindow) {
  ipcMain.handle('vm-start', async (e, { id, diskName, ports, cpuCore, memory }: VMStartOptions) => {
    if (diskName === 'ollama') {
      const root =
        process.env.NODE_ENV === 'development' ? path.join(process.env.APP_ROOT, 'public') : process.resourcesPath

      const binDir = path.join(process.env.HOME, '.nativenode', 'ollama')
      const binName = process.platform === 'win32' ? 'ollama.exe' : 'ollama'
      const binPath = path.join(binDir, binName)

      const ollamaProcess = spawn(`OLLAMA_ORIGINS='*' OLLAMA_HOST=0.0.0.0:11434 ./ollama serve`, {
        cwd: binDir,
        env: process.env,
        shell: true,
      })

      log('Running Ollama directly', id, binPath)

      vmProcesses.set(id, {
        id,
        process: ollamaProcess,
      })

      ollamaProcess.stdout.on('data', (data) => {
        win.webContents.send('vm-output', {
          id,
          data: data.toString(),
        })
      })

      ollamaProcess.stderr.on('data', (data) => {
        win.webContents.send('vm-output', {
          id,
          data: data.toString(),
        })
      })

      ollamaProcess.on('close', (code) => {
        win.webContents.send('vm-output', {
          id,
          data: `\nOllama exited with code ${code}\n`,
        })
        vmProcesses.delete(id)
      })

      return ollamaProcess.pid
    }

    const root =
      process.env.NODE_ENV === 'development' ? path.join(process.env.APP_ROOT, 'public') : process.resourcesPath

    const base = path.join(root, 'bin', process.platform === 'win32' ? 'windows' : 'mac', 'resources', 'qemu')

    const qemuPath = path.join(base, process.platform === 'win32' ? 'qemu-system-x86_64.exe' : 'qemu-system-x86_64')

    const diskPath = path.join(process.env.HOME, '.nativenode', 'downloads', diskName)
    console.log('disk name ', diskName)

    const portMap = ports.map((p) => `hostfwd=tcp::${p.exposed}-:${p.internal}`).join(',')
    const args = [
      '-L',
      'pc-bios',
      '-m',
      memory.toString(),
      '-smp',
      cpuCore.toString(),
      '-hda',
      diskPath,
      '-netdev',
      `user,id=net0,${portMap}`,
      '-device',
      'e1000,netdev=net0',
      '-nographic',
    ]

    const options = { cwd: base }

    const vmProcess = spawn(qemuPath, args, options)

    log('VM starting path', id, qemuPath, args.join(' '))
    vmProcesses.set(id, {
      process: vmProcess,
      id,
    })

    vmProcess.stdout.on('data', (data) => {
      win.webContents.send('vm-output', {
        id,
        data: data.toString(),
      })
    })

    vmProcess.stderr.on('data', (data) => {
      win.webContents.send('vm-output', {
        id,
        data: data.toString(),
      })
    })

    vmProcess.on('close', (code) => {
      win.webContents.send('vm-output', {
        id,
        data: `\nVM exited with code ${code}\n`,
      })
      vmProcesses.delete(id)
    })

    return vmProcess.pid
  })

  ipcMain.on('vm-input', (event, { id, input }: { id: string; input: string }) => {
    const vmProcess = vmProcesses.get(id)
    if (!vmProcess || !vmProcess.process.stdin.writable) return

    vmProcess.process.stdin.write(input)
  })

  ipcMain.handle('is-vm-ready', (e, id) => {
    const vmProcess = vmProcesses.get(id)
    return vmProcess && vmProcess.process.stdin.writable
  })

  ipcMain.handle('vm-kill', (e, id) => {
    const vmProcess = vmProcesses.get(id)
    log('VM killing path', id, vmProcess?.process.pid)
    if (vmProcess) {
      vmProcess.process.kill()
      vmProcesses.delete(id)
      return true
    }
    return false
  })

  ipcMain.handle('kill-all-vms', () => {
    log('VM killing all')
    vmProcesses.forEach((vmProcess) => {
      log('VM killing path', vmProcess.id, vmProcess.process.pid)
      vmProcess.process.kill()
      vmProcesses.delete(vmProcess.id)
    })
    vmProcesses.clear()
    return true
  })

  ipcMain.handle('vm-stop', async (_, id: string) => {
    const vmProc = vmProcesses.get(id)
    if (vmProc) {
      vmProc.process.kill()
      vmProcesses.delete(id)
      return true
    } else {
      console.warn(`[main] No process found for ${id}`)
      return false
    }
  })
}

export default vmProcessManager
