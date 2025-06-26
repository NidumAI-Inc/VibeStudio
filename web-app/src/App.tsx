/**
 * Main Application Component
 *
 * This is the root component that sets up the entire application structure.
 * It configures routing, global providers, and authentication context.
 *
 * Key Features:
 * - React Router for client-side routing
 * - React Query for server state management
 * - Authentication provider for user management
 * - Toast notifications and tooltips
 * - Protected routes for authenticated pages
 *
 * Architecture:
 * - Uses a centralized routing approach with all routes defined here
 * - Implements protected routes that require authentication
 * - Provides global context providers for the entire app
 */

import { Toaster } from '@/components/ui/toaster' // Toast notification system
import { Toaster as Sonner } from '@/components/ui/sonner' // Alternative toast system
import { TooltipProvider } from '@/components/ui/tooltip' // Tooltip context provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Server state management
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom' // Client-side routing
import { AuthProvider } from '@/hooks/useAuth' // Authentication context
import ProtectedRoute from '@/components/ProtectedRoute' // Route guard component

// Import all page components
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Dashboard from './pages/dashboard/Dashboard'
import ProjectView from './pages/ProjectView'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'
import SystemPrompt from './pages/SystemPrompt'
import InternetWatcher from './components/InternetWatcher'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner closeButton />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <InternetWatcher />
            <Routes>
              <Route path='/' element={<Navigate to='/login' replace />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/verify-otp' element={<VerifyOtp />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />

              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/settings'
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/system-prompt'
                element={
                  <ProtectedRoute>
                    <SystemPrompt />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/project/:projectId'
                element={
                  <ProtectedRoute>
                    <ProjectView />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/project/:projectId/:view'
                element={
                  <ProtectedRoute>
                    <ProjectView />
                  </ProtectedRoute>
                }
              />

              <Route path='*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
