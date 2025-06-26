export const extractSubdomain = (domain: string): { rootDomain: string; subdomain: string | null } => {
  const parts = domain.split('.')
  if (parts.length <= 2) return { rootDomain: domain, subdomain: null }
  return { rootDomain: parts.slice(1).join('.'), subdomain: parts[0] }
}

export const getDnsRecordDetails = (domain: string) => {
  const { rootDomain, subdomain } = extractSubdomain(domain)
  const ipAddress = '54.255.209.73'

  let recordName: string
  if (!subdomain) recordName = '@'
  else if (subdomain === 'www') recordName = 'www'
  else recordName = subdomain

  return {
    type: 'A',
    name: recordName,
    value: ipAddress,
    ttl: '3600',
    rootDomain,
    fullDomain: domain,
  }
}
