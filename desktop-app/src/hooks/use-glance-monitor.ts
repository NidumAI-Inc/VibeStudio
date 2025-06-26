import useUIStore from '@/store/ui'
import { CpuData, MemData, NetInterface } from '@/types/vm-monitor'
import { useEffect, useRef, useState } from 'react'

function formatSpeed(bytesPerSec: number): string {
  const kb = bytesPerSec / 1024
  const mb = kb / 1024
  return mb >= 1 ? `${mb.toFixed(2)} MB/s` : `${kb.toFixed(2)} KB/s`
}

export function useGlancesMonitor(pollInterval = 1000) {
  const [cpuData, setCpuData] = useState<number[]>([])
  const [memData, setMemData] = useState<number[]>([])
  const [speed, setSpeed] = useState<{ download: string; upload: string }>({
    download: '0 KB/s',
    upload: '0 KB/s',
  })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const data = useUIStore((s) => s.data)
  const API_BASE = `http://localhost:${data.port}/api/4`

  useEffect(() => {
    if (pollInterval <= 0) return

    const fetchData = async () => {
      try {
        const [cpuRes, memRes, netRes] = await Promise.all([
          fetch(`${API_BASE}/cpu`),
          fetch(`${API_BASE}/mem`),
          fetch(`${API_BASE}/network`),
        ])

        if (!cpuRes.ok || !memRes.ok || !netRes.ok) {
          throw new Error('API response not ok')
        }

        const cpu: CpuData = await cpuRes.json()
        const mem: MemData = await memRes.json()
        const net: NetInterface[] = await netRes.json()

        setCpuData((prev) => [...prev.slice(-59), cpu.total])
        setMemData((prev) => [...prev.slice(-59), mem.percent])

        const netSum = net.reduce(
          (acc, curr) => ({
            rx: acc.rx + curr.bytes_recv_rate_per_sec,
            tx: acc.tx + curr.bytes_sent_rate_per_sec,
          }),
          { rx: 0, tx: 0 }
        )

        setSpeed({
          download: formatSpeed(netSum.rx),
          upload: formatSpeed(netSum.tx),
        })
      } catch {
        // silent fail or could add error state
      }
    }

    fetchData()
    intervalRef.current = setInterval(fetchData, pollInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [pollInterval, API_BASE])

  return { cpuData, memData, speed }
}
