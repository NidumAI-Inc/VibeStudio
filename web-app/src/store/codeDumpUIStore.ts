import { create } from 'zustand'
import { WrittenAction } from '@/types/written-actions'

type CodeDumpUIStore = {
  showCodeDump: boolean
  setShowCodeDump: (show: boolean) => void
  selectedActions: WrittenAction[] | null
  setSelectedActions: (actions: WrittenAction[]) => void
}

export const useCodeDumpUIStore = create<CodeDumpUIStore>((set) => ({
  showCodeDump: false,
  setShowCodeDump: (show) => set({ showCodeDump: show }),
  selectedActions: null,
  setSelectedActions: (actions) => set({ selectedActions: actions }),
}))
