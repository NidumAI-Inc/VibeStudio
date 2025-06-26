export type CpuData = {
  total: number
  user: number
  nice: number
  system: number
  idle: number
  iowait: number
  irq: number
  steal: number
  guest: number
  ctx_switches: number
  interrupts: number
  soft_interrupts: number
  syscalls: number
  cpucore: number
  time_since_update: number
  ctx_switches_gauge: number
  ctx_switches_rate_per_sec: number
  interrupts_gauge: number
  interrupts_rate_per_sec: number
  soft_interrupts_gauge: number
  soft_interrupts_rate_per_sec: number
  syscalls_gauge: number
}

export type MemData = {
  total: number
  available: number
  percent: number
  used: number
  free: number
  active: number
  inactive: number
  buffers: number
  cached: number
  shared: number
}

export type NetInterface = {
  bytes_sent: number
  bytes_recv: number
  speed: number
  key: string
  interface_name: string
  alias: string | null
  bytes_all: number
  time_since_update: number
  bytes_recv_gauge: number
  bytes_recv_rate_per_sec: number
  bytes_sent_gauge: number
  bytes_sent_rate_per_sec: number
  bytes_all_gauge: number
  bytes_all_rate_per_sec: number
}
