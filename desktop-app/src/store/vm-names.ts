import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type vmNamesState = {
  list: Record<string, string>
}

type actions = {
  updateName: (id: string, name: string) => void
  update: (v: Partial<vmNamesState>) => void
  clear: () => void
}

const payload: vmNamesState = {
  list: {},
}

const useVMNamesStore = create<vmNamesState & actions>()(
  persist(
    (set) => ({
      ...payload,

      updateName: (id, name) => set((state) => ({
        list: {
          ...state.list,
          [id]: name
        }
      })),

      update: (payload) => set({ ...payload }),

      clear: () => set({ ...payload }),
    }),
    {
      name: 'vm-names-storage',
    }
  )
)

export default useVMNamesStore
