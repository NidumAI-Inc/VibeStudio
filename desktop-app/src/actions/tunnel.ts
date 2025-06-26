import axios from "axios";

import { root } from "@/services/end-points";

export function tunnelUrlConfig() {
  return axios.post(`${root.localBackendUrl}/tunnel/url-config`).then(r => r.data)
}

export function tunnelEnable() {
  return axios.post(`${root.localBackendUrl}/tunnel/enable`).then(r => r.data)
}

export function tunnelReserve(data: { id: string, port: number }) {
  return axios.post(`${root.localBackendUrl}/tunnel/reserve`, data).then(r => r.data)
}

export function tunnelSetupStatus() {
  return axios.post(`${root.localBackendUrl}/tunnel/setup-status`).then(r => r.data)
}

export async function tunnelSetupFlow(disable?: boolean) {
  try {
    if (disable) {
      await clearTunnel()
    }
    await tunnelUrlConfig()
    await tunnelEnable()

  } catch (error) {
    console.log(error)
  }
}

export function goPublic(id: string) {
  return axios.post(`${root.localBackendUrl}/tunnel/go-public`, { id }).then(r => r.data)
}

export function stopPublic(id: string) {
  return axios.post(`${root.localBackendUrl}/tunnel/stop-public`, { id }).then(r => r.data)
}

export function stopTunnel() {
  return axios.post(`${root.localBackendUrl}/tunnel/stop`).then(r => r.data)
}

export function clearTunnel() {
  return axios.post(`${root.localBackendUrl}/tunnel/clear`).then(r => r.data)
}

export async function isLiveCheck(id: string) {
  const response = await fetch(`https://${id}.link.nativenode.host`)
  const status = response.status
  return status === 200
}

