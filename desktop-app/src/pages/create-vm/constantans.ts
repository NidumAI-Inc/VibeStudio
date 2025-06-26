import { portsT } from '@/types/vm'
import { LucideIcon, Rocket, Settings, Briefcase, Building2, BriefcaseBusiness, Package } from 'lucide-react'

export type resourseT = {
  label: string
  cpu: number
  ram: number
  description: string
  icon: LucideIcon
}

export const resourceConfigs: Record<string, resourseT> = {
  starter: {
    label: 'Starter',
    cpu: 2,
    ram: 4,
    description: 'Perfect for development and testing',
    icon: Rocket,
  },
  standard: {
    label: 'Standard',
    cpu: 4,
    ram: 8,
    description: 'Ideal for small production workloads',
    icon: Package,
  },
  professional: {
    label: 'Professional',
    cpu: 8,
    ram: 16,
    description: 'For medium-sized applications',
    icon: BriefcaseBusiness,
  },
  enterprise: {
    label: 'Enterprise',
    cpu: 16,
    ram: 24,
    description: 'High-performance computing needs',
    icon: Building2,
  },
}

export const steps = [
  { id: 'basics', label: 'Basic Info' },
  { id: 'resources', label: 'Resources' },
  { id: 'review', label: 'Review' },
]

export const vmTypes = [
  {
    id: 'VibeCoding',
    url: 'https://nativenode.s3.ap-southeast-1.amazonaws.com/disk-100g-VIBE.img',
    icon: 'VibeCoding',
    value: 'VibeCoding',
    title: 'VibeStudio Server',
    iconColor: 'text-orange-500',
    description: 'VibeStudio platform app server',
  },
]

export const ports: Record<string, portsT> = {
  VibeCoding: {
    glance: {
      internal: 61208,
      exposed: 61212,
      enabled: true,
      editable: false,
      description: 'System resource usage for VibeStudio',
    },
    fs_api: {
      internal: 8954,
      exposed: 8964,
      enabled: true,
      editable: false,
      description: 'VibeStudio file system API',
    },
    vm: [
      {
        internal: 4327,
        exposed: 4327,
        enabled: true,
        editable: false,
        description: 'Default port for accessing VibeStudio App',
      },
      {
        internal: 3455,
        exposed: 3455,
        enabled: true,
        editable: false,
        description: 'Default port for accessing the JS Application',
      },
    ],
  },
}

export const configPath: any = {}
