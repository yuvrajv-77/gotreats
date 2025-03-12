import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'



const AdminRoutes = () => {
  const { user, userDetails } = useAuthStore()
  
  if (!user || !userDetails) {
    return <Navigate to="/login" replace />
  }

  if (!userDetails || userDetails?.phoneNumber !== '7905146108') {
    return <Navigate to="/" replace />
  }

  return <Outlet/>
}

export default AdminRoutes
