import { shell, Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import packageJson from '../package.json'

function createMenu() {
  if (process.platform === 'darwin') {
    const helpMenuTemplate = [
      {
        label: 'Help',
        submenu: [
          {
            label: 'Help Information',
            click: () => {
              // Display help message with a description, email, and link
              dialog
                .showMessageBox({
                  type: 'info',
                  title: 'Help',
                  message: `For assistance, you can reach us at info@nativenode.tech or visit our website. Version: ${packageJson.version}`,
                  detail: 'Visit https://nativenode.tech/ for more information.',
                  buttons: ['Open Website', 'Close'],
                })
                .then((result) => {
                  // If the user clicks 'Open Website', open the URL
                  if (result.response === 0) {
                    shell.openExternal('https://nativenode.tech/')
                  }
                })
            },
          },
          {
            label: 'Check for update',
            click: () => {
              autoUpdater.checkForUpdatesAndNotify()

              autoUpdater.once('update-not-available', () => {
                dialog.showMessageBox({
                  type: 'info',
                  title: 'No Updates Available',
                  message: 'You are using the latest version of the application.',
                })
              })
            },
          },
        ],
      },
    ]

    const defaultMenu = Menu.getApplicationMenu()
    const menuItems = defaultMenu ? defaultMenu.items : []

    const filteredMenuItems = menuItems.filter((item) => item.label !== 'Help')

    const updatedMenu = Menu.buildFromTemplate([...filteredMenuItems, ...helpMenuTemplate])

    // Set the updated menu
    Menu.setApplicationMenu(updatedMenu)
  }
}

export default createMenu
