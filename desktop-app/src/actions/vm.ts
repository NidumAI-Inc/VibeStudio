import axios from "axios";

import { endPoints } from "@/services/end-points";
import sendApiReq from "@/services/send-api-req";
import useVMStore from "@/store/vm";
import { delay } from "@/utils";

export async function vmWait(id: string, ms: number = 10000) {
  const lastStartedAt = useVMStore.getState().vms.find(v => v.id === id)?.lastStartedAt
  const diff = new Date().getTime() - new Date(lastStartedAt || new Date().toISOString()).getTime()

  if (diff < ms) {
    await delay(ms)
  }

  return true
}

export async function getVMInfo(id: string, port: number, type: string) {
  await vmWait(id, 15000)
  return axios.get(`http://localhost:${port}/api/4/${type}`).then(r => r.data)
}

type returnT = Array<{
  id: string;
  glance: number;
  isTunnelRunning: boolean;
  isDomainRunning: boolean;
}>
export function getNetworkUsageInfos(data: returnT) {
  return Promise.all(data.map(async (vm) => {
    const network = await getVMInfo(vm.id, vm.glance, 'network')

    return {
      ...vm,
      network,
    }
  }))
}

export function deleteNode(nodePath: string) {
  return sendApiReq({
    url: `${endPoints.nodes.root}?nodePath=${nodePath}`,
    isLocal: true,
    method: 'delete',
  })
}

export function checkPortInUse(port: number) {
  return sendApiReq({
    url: `${endPoints.general.checkPortInUse}`,
    isLocal: true,
    method: 'post',
    data: { port }
  })
}

export async function lampActions(id: string, port: number, action: 'start' | 'stop' | 'restart') {
  await vmWait(id)
  return axios.get(`http://localhost:${port}/lamp/${action}`).then(r => r.data)
}

export async function isLampLive(id: string, port: number) {
  await vmWait(id)
  return sendApiReq({
    url: `${endPoints.general.checkLampLive}?port=${port}`,
    isLocal: true,
  })
}
