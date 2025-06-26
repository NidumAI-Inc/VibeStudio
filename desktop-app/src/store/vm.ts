import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { deployManagerT, domainT, tunnelT, VM } from '../types/vm'

type vmState = {
  vms: VM[]
}

type actions = {
  addVM: (vm: VM) => void
  updateVM: (id: string, vm: Partial<VM>) => void
  removeVM: (id: string) => void

  update: (v: Partial<vmState>) => void
  clear: () => void

  resetStatuses: () => void

  addDeployManager: (vmId: string, deployManager: deployManagerT) => void
  updateDeployManager: (vmId: string, application_id: string, deployManager: Partial<deployManagerT>) => void
  removeDeployManager: (vmId: string, application_id: string) => void

  addTunnel: (vmId: string, tunnel: tunnelT) => void
  updateTunnel: (vmId: string, id: string, tunnel: Partial<tunnelT>) => void
  removeTunnel: (vmId: string, id: string) => void
  clearTunnel: (vmId: string) => void
  resetTunnelPublic: (vmId: string) => void

  addDomain: (vmId: string, domain: domainT) => void
  updateDomain: (vmId: string, id: string, domain: Partial<domainT>) => void
  removeDomain: (vmId: string, id: string) => void
}

const payload: vmState = {
  vms: [],
}

const useVMStore = create<vmState & actions>()(
  persist(
    (set) => ({
      ...payload,

      addVM: (vm) =>
        set((state) => ({
          vms: [...state.vms, vm],
        })),

      updateVM: (id, vm) =>
        set((state) => ({
          vms: state.vms.map((v) => (v.id === id ? { ...v, ...vm } : v)),
        })),

      removeVM: (id) =>
        set((state) => ({
          vms: state.vms.filter((v) => v.id !== id),
        })),

      update: (payload) => set((state) => ({ ...state, ...payload })),

      clear: () => set({ ...payload }),

      resetStatuses: () =>
        set((state) => ({
          vms: state.vms.map((v) => ({ ...v, status: 'idle', needRestart: false })),
        })),

      addDeployManager: (vmId, deployManager) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                deployManager: [...(v.deployManager || []), deployManager],
              }
            }
            return v
          }),
        })),

      updateDeployManager: (vmId, application_id, deployManager) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                deployManager: v.deployManager?.map((d) => {
                  if (d.application_id === application_id) {
                    return {
                      ...d,
                      ...deployManager,
                    }
                  }
                  return d
                }),
              }
            }
            return v
          }),
        })),

      removeDeployManager: (vmId, application_id) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                deployManager: v.deployManager?.filter((d) => d.application_id !== application_id),
              }
            }
            return v
          }),
        })),

      addTunnel: (vmId, tunnel) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                tunnel: [...(v.tunnel || []), tunnel],
              }
            }
            return v
          }),
        })),

      updateTunnel: (vmId, id, tunnel) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                tunnel: v.tunnel?.map((t) => {
                  if (t.id === id) {
                    return {
                      ...t,
                      ...tunnel,
                    }
                  }
                  return t
                }),
              }
            }
            return v
          }),
        })),

      removeTunnel: (vmId, id) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                tunnel: v.tunnel?.filter((t) => t.id !== id),
              }
            }
            return v
          }),
        })),

      clearTunnel: (vmId) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                tunnel: [],
              }
            }
            return v
          }),
        })),

      resetTunnelPublic: (vmId) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                tunnel: v.tunnel?.map((t) => ({
                  ...t,
                  is_public: false,
                })),
              }
            }
            return v
          }),
        })),

      addDomain: (vmId, domain) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                domains: [...(v.domains || []), domain],
              }
            }
            return v
          }),
        })),

      updateDomain: (vmId, id, domain) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                domains: v.domains?.map((d) => {
                  if (d.id === id) {
                    return {
                      ...d,
                      ...domain,
                    }
                  }
                  return d
                }),
              }
            }
            return v
          }),
        })),

      removeDomain: (vmId, id) =>
        set((state) => ({
          vms: state.vms.map((v) => {
            if (v.id === vmId) {
              return {
                ...v,
                domains: v.domains?.filter((d) => d.id !== id),
              }
            }
            return v
          }),
        })),
    }),
    {
      name: 'vm-storage',
    }
  )
)

export default useVMStore
