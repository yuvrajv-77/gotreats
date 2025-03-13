import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'

const AdminRoutes = () => {
  const { userDetails } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (userDetails !== null) {
      if (userDetails?.phoneNumber === '7905146108') {
        const adminPassword = "k55li"
        const userInput = window.prompt('Enter Admin Password:')
        
        if (userInput === adminPassword) {
          setIsAuthenticated(true)
        }
      }
      setIsLoading(false)
    }
  }, [userDetails])

  if (isLoading) {
    return <div className='flex items-center justify-center h-screen w-full border'>
      <img src="https://media1.tenor.com/m/DfSs6KiP6-kAAAAC/akshay-kumar-smile.gif" alt="" />
    </div>
  }

  if (!isAuthenticated || userDetails?.phoneNumber !== '7905146108') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoutes