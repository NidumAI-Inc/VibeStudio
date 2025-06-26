import axios from 'axios'

import { vmWait } from './vm'
import { Framework } from '@/types/vm'

export async function getAllDeployments(id: string, port: number) {
  await vmWait(id)
  return axios.get(`http://localhost:${port}/deployments`).then((r) => r.data)
}

export async function getDeploymentStatus(id: string, port: number, applicationId: string) {
  await vmWait(id, 28000)
  return axios.get(`http://localhost:${port}/status/${applicationId}`).then((r) => r.data)
}

export async function getDeploymentLogs(id: string, port: number, applicationId: string, lines = 100) {
  await vmWait(id)
  return axios.get(`http://localhost:${port}/logs/${applicationId}?lines=${lines}`).then((r) => r.data)
}

export type deployReq = {
  description: string
  framework: Framework
  repo_url: string
  start_command: string[]
  port: number
}

export function createDeploy(port: number, data: deployReq) {
  return axios.post(`http://localhost:${port}/deploy`, data).then((r) => r.data)
}

export function smartDeploy(port: number, data: Partial<deployReq>, signal?: AbortSignal) {
  return axios.post(`http://localhost:${port}/smart-deploy`, data, { signal }).then((r) => r.data)
}

export type zipDeployReq = {
  metadata_json: {
    port: number
  }
  file: File
}
export function zipDeploy(port: number, data: Partial<zipDeployReq>, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('metadata_json', JSON.stringify(data.metadata_json))
  return axios.post(`http://localhost:${port}/deploy-zip`, formData, {
    signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }).then((r) => r.data)
}

export function zipReDeploy(port: number, data: Partial<zipDeployReq> & { applicationId: string }, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('metadata_json', JSON.stringify(data.metadata_json))
  return axios.post(`http://localhost:${port}/redeploy-deploy/${data.applicationId}`, formData, {
    signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }).then((r) => r.data)
}

export function stop(port: number, applicationId: string) {
  return axios.post(`http://localhost:${port}/stop/${applicationId}`).then((r) => r.data)
}

export function restart(port: number, applicationId: string) {
  return axios.post(`http://localhost:${port}/restart/${applicationId}`).then((r) => r.data)
}

export function enhancedRestart(port: number, applicationId: string, newPort: number) {
  return axios.post(`http://localhost:${port}/enhanced-restart/${applicationId}?port=${newPort}`).then((r) => r.data)
}

export function redeploy(port: number, applicationId: string, newPort: number) {
  return axios.post(`http://localhost:${port}/redeploy/${applicationId}?port=${newPort}`).then((r) => r.data)
}

export function undeploy(port: number, applicationId: string) {
  return axios.delete(`http://localhost:${port}/undeploy/${applicationId}`).then((r) => r.data)
}
