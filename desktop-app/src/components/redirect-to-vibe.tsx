import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useVMStore from '@/store/vm'

function RedirectToVibe() {
  const navigate = useNavigate()
  const vms = useVMStore((s) => s.vms)
  
  useEffect(() => {
    const vibeVM = vms.find(vm => vm.type === 'VibeCoding' && vm.downloaded)
    
    if (vibeVM) {
      // If VibeCoding VM exists and is downloaded, go to its details
      navigate(`/vm/${vibeVM.id}`, { replace: true })
    } else {
      // Otherwise, go to setup page
      navigate('/', { replace: true })
    }
  }, [navigate, vms])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}

export default RedirectToVibe