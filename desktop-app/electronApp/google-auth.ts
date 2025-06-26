import { BrowserWindow } from "electron";

async function googleAuth() {
  const authWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  return new Promise((resolve, reject) => {
    const backendUrl = "https://nativenode.link.nativenode.host:5633/api"
    authWindow.loadURL(`${backendUrl}/auth/google`)

    authWindow.webContents.on('did-finish-load', async () => {
      const currentUrl = authWindow.webContents.getURL()

      if (currentUrl.startsWith(`${backendUrl}/auth/google/callback`)) {
        try {
          const data = await authWindow.webContents.executeJavaScript(`
            new Promise((resolve, reject) => {
              try {
                const jsonResponse = JSON.parse(document.body.innerText)
                resolve(jsonResponse)
              } catch (error) {
                reject(error)
              }
            })
          `)

          authWindow.close()

          resolve(data)
        } catch (error) {
          reject(new Error('Failed to extract data from the callback page.'))
        }
      }
    })

    authWindow.on('closed', () => {
      reject('Auth window was closed prematurely')
    })
  })
}

export default googleAuth
