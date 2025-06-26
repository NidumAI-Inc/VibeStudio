import { ipcMain } from 'electron'
import * as si from 'systeminformation'
import os from 'os'

function getSystemInfo() {
  ipcMain.handle('get-system-status', async () => {
    const cpuLoadData = await si.currentLoad()
    const totalCpuUsage = cpuLoadData.currentLoad.toFixed(2)

    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    const totalMemoryGB = totalMemory / 1024 / 1024 / 1024
    const usedMemoryGB = usedMemory / 1024 / 1024 / 1024
    const ramUsagePercentage = ((usedMemoryGB / totalMemoryGB) * 100).toFixed(2)

    const disks = await si.fsSize()
    let systemDisk = disks.find((disk) => disk.mount === (process.platform === 'win32' ? 'C:' : '/System/Volumes/Data'))

    if (!systemDisk) {
      systemDisk = disks.find((disk) => disk.mount === '/')
    }
    const totalDiskGB = systemDisk ? systemDisk.size / 1024 / 1024 / 1024 : 0
    const usedDiskGB = systemDisk ? systemDisk.used / 1024 / 1024 / 1024 : 0
    const diskUsagePercentage = totalDiskGB > 0 ? ((usedDiskGB / totalDiskGB) * 100).toFixed(2) : '0'

    return {
      cpuUsage: `${totalCpuUsage}`,
      ram: {
        used: parseFloat(usedMemoryGB.toFixed(2)),
        total: parseFloat(totalMemoryGB.toFixed(2)),
        percentage: parseFloat(ramUsagePercentage),
      },
      disk: {
        used: parseFloat(usedDiskGB.toFixed(2)),
        total: parseFloat(totalDiskGB.toFixed(2)),
        percentage: parseFloat(diskUsagePercentage),
      },
    }
  })
}

export default getSystemInfo
