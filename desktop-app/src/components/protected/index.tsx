import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/auth';

function Protected() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)

  if (!isLoggedIn) return <Navigate to='/login' />

  return <Outlet />
}

export default Protected