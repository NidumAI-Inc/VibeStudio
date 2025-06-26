import { QueryClientProvider } from '@tanstack/react-query'
import { HashRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '../../lib/query-client'
import { ThemeProvider } from './theme-provider'

type props = Readonly<{
  children: React.ReactNode
}>

function ClientWrapper({ children }: props) {
  return (
    <HashRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

        <Toaster richColors closeButton theme='light' position='top-right' />
      </ThemeProvider>
    </HashRouter>
  )
}

export default ClientWrapper
