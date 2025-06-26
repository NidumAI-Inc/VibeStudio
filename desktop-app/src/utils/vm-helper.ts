import { VM } from "@/types/vm";

export const activeVms = (vms: VM[]) => {
  type returnT = Array<{
    id: string;
    glance: number;
    isTunnelRunning: boolean;
    isDomainRunning: boolean;
  }>

  return vms.reduce<returnT>((acc, vm) => {
    if (vm.status !== 'running') return acc;

    const isTunnelRunning = vm.tunnel?.some(t => t.is_public) ?? false;
    const isDomainRunning = vm.domains?.some(d => d.isRunning) ?? false;

    if (!(isTunnelRunning || isDomainRunning)) return acc;

    acc.push({
      id: vm.id,
      glance: vm.ports?.glance?.exposed,
      isTunnelRunning,
      isDomainRunning
    });

    return acc;
  }, [])
}

export const getNetworkBytes = (network: any) => {
  let totalDownloadBytesPerSec = 0
  let totalUploadBytesPerSec = 0

  if (network) {
    for (const iface of network) {
      totalDownloadBytesPerSec += iface.bytes_recv_rate_per_sec
      totalUploadBytesPerSec += iface.bytes_sent_rate_per_sec
    }
  }

  const downloadMbps = ((totalDownloadBytesPerSec * 8) / 1_000_000)
  const uploadMbps = ((totalUploadBytesPerSec * 8) / 1_000_000)

  return {
    downloadMbps,
    uploadMbps,
  }
}
