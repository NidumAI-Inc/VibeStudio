import { customAlphabet } from 'nanoid'

export const delay = (ms: number = 1000) => new Promise((res) => setTimeout(res, ms))

export function generateNumberArray(n: number): number[] {
  if (n <= 0) throw new Error('Input must be a positive integer.')
  return Array.from({ length: n }, (_, i) => i + 1)
}

export function getRandNumber(min: number = 20, max: number = 70): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-emerald-500'
    case 'stopped':
      return 'bg-slate-400'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-yellow-500'
  }
}

export const getVMIcon = (type: string) => {
  switch (type) {
    case 'VibeCoding':
      return 'box'
    default:
      return 'box'
  }
}

export const getProgressColor = (usage: number) => {
  if (usage > 80) return 'bg-red-500 dark:[background-color:oklch(0.5_0.17_23.26)]'
  if (usage > 60) return 'bg-orange-400'
  return 'bg-green-500'
}

export type RetryOptions = {
  retriesLeft?: number
  interval?: number
  factor?: number
  signal?: AbortSignal
}

export const retry = <T>(
  fn: () => Promise<T>,
  { retriesLeft = 5, interval = 1000, factor = 1, signal }: RetryOptions = {}
): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    fn()
      .then(resolve)
      .catch((error) => {
        if (retriesLeft <= 1 || signal?.aborted) {
          return reject(error)
        }

        const timeout = setTimeout(() => {
          retry(fn, {
            retriesLeft: retriesLeft - 1,
            interval: interval * factor,
            factor,
            signal,
          })
            .then(resolve)
            .catch(reject)
        }, interval)

        signal?.addEventListener(
          'abort',
          () => {
            clearTimeout(timeout)
            reject(new DOMException('Aborted', 'AbortError'))
          },
          { once: true }
        )
      })
  })
}

export function generateURLSafeId(num = 20) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const nanoid = customAlphabet(alphabet, num)
  return nanoid()
}

export function formatDate(timestamp?: number): string {
  if (!timestamp) return '--'

  const date = new Date(timestamp * 1000)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
