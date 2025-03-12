import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'

const AdminRoutes = () => {
  const { userDetails } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for userDetails to be available
    if (userDetails !== null) {
      setIsLoading(false)
    }
  }, [userDetails])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (userDetails?.phoneNumber !== '7905146108') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoutes