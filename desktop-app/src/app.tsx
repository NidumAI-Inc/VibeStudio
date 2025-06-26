import { useRoutes } from 'react-router-dom'

import { useKillAllVms, useVmSocket, useVmWatch } from '@/hooks/use-vm'

import DownloadProgressCard from './components/download-progress-card'
import Protected from './components/protected'

import ForgetPass from './pages/forgot-pass'
import ResetPass from './pages/reset-pass'
import Signup from './pages/signup'
import Login from './pages/login'

import CodeEditorPage from './pages/code-editor'
import VMDetails from './pages/vm-details'
import Profile from './pages/profile'
import VibeSetupPage from './pages/vibe-setup'
import RedirectToVibe from './components/redirect-to-vibe'

const routes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
  {
    path: 'forgot-pass',
    element: <ForgetPass />,
  },
  {
    path: 'reset-pass',
    element: <ResetPass />,
  },
  {
    path: '/',
    element: <Protected />,
    children: [
      {
        index: true,
        element: <VibeSetupPage />,
      },
      {
        path: 'code-editor/:id',
        element: <CodeEditorPage />,
      },
      {
        path: 'vm/:id',
        element: <VMDetails />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'create-vm',
        element: <RedirectToVibe />,
      },
      {
        path: 'home',
        element: <RedirectToVibe />,
      },
      {
        path: '*',
        element: <RedirectToVibe />,
      },
    ],
  },
]

function App() {
  const routeList = useRoutes(routes)

  useVmWatch()
  useKillAllVms()
  useVmSocket()

  return (
    <>
      {routeList}
      <DownloadProgressCard />
    </>
  )
}

export default App
