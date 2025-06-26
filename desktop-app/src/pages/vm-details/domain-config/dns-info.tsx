import { Info } from 'lucide-react'

interface Props {
  dnsDetails: {
    type: string
    name: string
    value: string
    ttl: string
    rootDomain: string
    fullDomain: string
  }
}

const DNSInstructions = ({ dnsDetails }: Props) => {
  return (
    <div className='rounded-lg border p-4 bg-muted/50 space-y-4'>
      <div className='flex items-start gap-2'>
        <Info className='h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0' />
        <div>
          <h4 className='font-medium mb-2'>DNS Configuration Instructions</h4>
          <p className='text-sm text-muted-foreground mb-4'>
            To connect <strong>{dnsDetails.fullDomain}</strong> to your virtual machine, add the following DNS record to
            your domain provider's settings for <strong>{dnsDetails.rootDomain}</strong>:
          </p>
          <div className='bg-background rounded-md p-4 font-mono text-sm space-y-2'>
            <p>
              <span className='text-muted-foreground'>Record Type:</span> {dnsDetails.type}
            </p>
            <p>
              <span className='text-muted-foreground'>Name:</span> <strong>{dnsDetails.name}</strong>{' '}
              {dnsDetails.name === '@' && (
                <span className='text-xs text-muted-foreground'>(represents the root domain)</span>
              )}
            </p>
            <p>
              <span className='text-muted-foreground'>Value:</span> {dnsDetails.value}
            </p>
            <p>
              <span className='text-muted-foreground'>TTL:</span> {dnsDetails.ttl}
            </p>
          </div>
        </div>
      </div>
      <div className='text-sm text-muted-foreground pl-7'>
        <p className='font-medium mb-2'>Important Notes:</p>
        <ul className='list-disc pl-4 space-y-1'>
          <li>DNS changes can take up to 48 hours to propagate globally</li>
          <li>
            For root domains (example.com), use <code>@</code> as the "Name" field
          </li>
          <li>
            For subdomains (app.example.com), use <code>app</code> as the "Name" field
          </li>
          <li>For www subdomain, some providers may require a CNAME record instead</li>
          <li>After adding the DNS record, click the "Verify" button to check if your domain is properly configured</li>
        </ul>
      </div>
    </div>
  )
}

export default DNSInstructions
