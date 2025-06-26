import { useState } from 'react'
import { Loader } from 'lucide-react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'

import { useCreateDomain, useCreateFrpcFile } from '@/hooks/use-frpc'
import { getDnsRecordDetails } from './helpers'
import useVMStore from '@/store/vm'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import DNSInstructions from './dns-info'

interface Props {
  id: string
  onCancel: () => void
}

function DomainForm({ id, onCancel }: Props) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedPort, setSelectedPort] = useState('')
  const [domainName, setDomainName] = useState('')

  const vm = useVMStore((s) => s.vms?.find((v) => v.id === id))

  const { mutateAsync: createFrpcFile, isPending: isCreatingFrpcFile } = useCreateFrpcFile()
  const { mutateAsync: createDomain, isPending: isCreatingDomain } = useCreateDomain()
  const addDomain = useVMStore((s) => s.addDomain)

  const isLoading = isCreatingFrpcFile || isCreatingDomain

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    const domain = domainName.trim().toLowerCase()

    if (!domain) {
      toast.error('Please enter a domain name')
      return
    }

    if (domain.startsWith('http://') || domain.startsWith('https://')) {
      toast.error('Invalid format. Please enter only the domain name (e.g., example.com)')
      return
    }

    setShowInstructions(true)
  }

  async function handleSubmit() {
    if (!domainName.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    if (domainName.startsWith('http://') || domainName.startsWith('https://')) {
      toast.error('Invalid format. Please enter only the domain name (e.g., example.com)')
      return
    }

    try {
      const user_id = nanoid()

      await Promise.all([
        createDomain({
          domain: domainName,
          user_id,
        }),
        createFrpcFile({
          domain: domainName,
          port: Number(selectedPort),
        }),
      ])

      addDomain(id, {
        id: user_id,
        domain: domainName,
        port: Number(selectedPort),
        isVerified: false,
        isVerifying: false,
        isRunning: false,
      })

      toast.success('Domain added successfully')
      onCancel()
    } catch (error) {
      toast.error('Failed to add domain')
    }
  }

  const exposedPorts =
    vm?.ports?.vm
      ?.map((p) => p.exposed)
      .filter((port) => ![3401, 6222].includes(port))
      .map(String) || []

  return (
    <>
      <form onSubmit={handleAddDomain} className='space-y-4'>
        <div className='space-y-4'>
          <div>
            <label htmlFor='domain-name' className='text-sm font-medium block mb-1'>
              Domain Name
            </label>
            <Input
              id='domain-name'
              placeholder='Enter your domain (e.g., app.example.com)'
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className='max-w-md'
            />
          </div>

          <div>
            <label htmlFor='port-select' className='text-sm font-medium block mb-1'>
              Port
            </label>

            <Select value={selectedPort} onValueChange={setSelectedPort}>
              <SelectTrigger id='port-select' className='w-1/2'>
                <SelectValue placeholder='Select port' />
              </SelectTrigger>
              <SelectContent>
                {exposedPorts.map((port) => (
                  <SelectItem key={`${port}`} value={`${port}`}>
                    {port}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!showInstructions && (
          <div className='df mt-8'>
            <Button type='button' variant='secondary' onClick={onCancel}>
              Cancel
            </Button>

            <Button type='submit'>Proceed</Button>
          </div>
        )}
      </form>

      {showInstructions && (
        <Collapsible open className='mt-6'>
          <CollapsibleContent>
            <DNSInstructions dnsDetails={getDnsRecordDetails(domainName)} />

            <div className='df mt-8'>
              <Button type='button' variant='secondary' onClick={onCancel}>
                Cancel
              </Button>

              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader className='size-4 animate-spin' />}
                Add Domain
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  )
}

export default DomainForm
