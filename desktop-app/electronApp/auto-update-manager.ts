import { BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

function autoUpdateManager(win: BrowserWindow) {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://releases.vibestud.io/vibestudio/',
  })

  autoUpdater.on('checking-for-update', () => {
    win?.webContents.send('app-updater', { status: 'checking' })
    log.info('Checking for updates...')
  })

  autoUpdater.on('update-available', (info) => {
    log.info('Update available.')
    log.info(`Latest version available: ${info.version}`)
    log.info('Prompting user to download the update...')

    win?.webContents.send('app-updater', { status: 'available' })

    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version is available. Do you want to download it now?',
        buttons: ['Download', 'Cancel'],
      })
      .then((result) => {
        const buttonIndex = result.response

        if (buttonIndex === 0) {
          log.info('User chose to download the update.')
          autoUpdater.downloadUpdate()
        } else {
          log.info('User canceled the update download.')
        }
      })
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info('No updates available.')
    log.info(`Checked version: ${info.version}`)
    win?.webContents.send('app-updater', { status: 'not-available' })
  })

  autoUpdater.on('error', (err) => {
    log.info('Error in auto-updater:', err)
    win?.webContents.send('app-updater', { status: 'error' })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Download speed: ${progressObj.bytesPerSecond} B/s`)
    log.info(`Downloaded ${progressObj.percent}%`)
    log.info(`${progressObj.transferred} bytes out of ${progressObj.total} bytes.`)
    win?.webContents.send('app-updater', { status: 'downloading', progress: progressObj })
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded.')
    log.info(`Downloaded version: ${info.version}`)
    log.info('Prompting user to restart the application...')

    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'A new version has been downloaded. Restart the application to apply the updates.',
        buttons: ['Restart', 'Later'],
      })
      .then((returnValue) => {
        if (returnValue.response === 0) {
          log.info('User chose to restart the application to install the update.')
          autoUpdater.quitAndInstall(false, true)
        } else {
          log.info('User chose to install the update later.')
        }
      })
  })

  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 5000)
}

export default autoUpdateManager
