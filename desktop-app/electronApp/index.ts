import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import path from 'node:path'
import log from 'electron-log'

import autoUpdateManager from './auto-update-manager'
import vmProcessManager from './vm-process-manager'
import getSystemInfo from './get-system-info'
import createMenu from './create-menu'
import googleAuth from './google-auth'
import server from './server'
import { Server } from 'node:http'
import { stopTTSService } from './server/features/tts-server'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let serverApp: any

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('nativenode', process.execPath, [path.resolve(process.argv[1] as string)])
  }
} else {
  app.setAsDefaultProtocolClient('nativenode')
}

function createWindow() {
  serverApp = server.listen(40901, () => {
    log.info('connected')
  })
  const icon = process.platform === 'win32' ? 'icon.ico' : 'icon.icns'
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, icon),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
    },
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 300,
    autoHideMenuBar: process.platform === 'win32' ? true : false,
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    return { action: 'allow' }
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })
  if (process.env.NODE_ENV) {
    win.webContents.openDevTools()
  }

  if (VITE_DEV_SERVER_URL) void win.loadURL(VITE_DEV_SERVER_URL)
  else void win.loadFile(path.join(RENDERER_DIST, 'index.html'))

  autoUpdateManager(win)
  vmProcessManager(win)
  getSystemInfo()

  win.on('close', () => {
    if (serverApp) {
      log.info('closing serverApp....')
      serverApp?.close?.()

      if (process.platform !== 'win32') {
        spawn('killall', ['-9', 'qemu-system-x86_64'])
        app.quit()
      }
    }
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }

    if (process.platform === 'win32') {
      win?.webContents?.send('open-url', commandLine?.pop())
    }
  })

  app.whenReady().then(() => {
    createWindow()
    createMenu()
  })

  if (process.platform !== 'win32') {
    app.on('open-url', (event, url) => {
      win?.webContents?.send('open-url', url)
    })
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    // win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('before-quit', async () => {
  if (ttsServer) await stopTTSService()
})

ipcMain.on('app:restart', () => {
  app.relaunch()
  app.exit(0)
})

ipcMain.on('open-external', (_event, url: string) => {
  shell.openExternal(url)
})

ipcMain.handle('auth:google', googleAuth)

ipcMain.handle('dialog:select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
})

let ttsServer: Server | null = null

ipcMain.handle('tts:install', async () => {
  if (ttsServer) {
    return true
  }

  const { startTTSService } = await import('./server/features/tts-server')
  ttsServer = await startTTSService()

  return true
})

ipcMain.handle('tts:stop', async () => {
  if (ttsServer) {
    const { stopTTSService } = await import('./server/features/tts-server')
    await stopTTSService()
    ttsServer = null
  } else {
    //
  }
})
