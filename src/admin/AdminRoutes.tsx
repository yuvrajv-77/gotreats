import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import Button from '../components/Button'
import { Key } from 'lucide-react'
import { validateAdminPassword } from '../services/authService'
import { HeroUIProvider } from '@heroui/system'

const AdminRoutes = () => {
  const { userDetails } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [input, setInput] = useState('')

  useEffect(() => {
    // Check if the user is already authenticated for the day
    const authData = localStorage.getItem('adminAuth')
    if (authData) {
      const { date, isAuthenticated } = JSON.parse(authData)
      const today = new Date().toISOString().split('T')[0]
      if (date === today && isAuthenticated) {
        setIsAuthenticated(true)
        setIsLoading(false)
      } else {
        localStorage.removeItem('adminAuth') // Clear outdated auth data
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const isValidPassword = await validateAdminPassword(input) // Server-side validation
      if (isValidPassword) {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem('adminAuth', JSON.stringify({ date: today, isAuthenticated: true }))
        setIsAuthenticated(true)
      } else {
        alert('Invalid password')
      }
    } catch (error) {
      console.error('Error validating password:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <form onSubmit={handleSubmit} className=' text-white bg-zinc-800 flex flex-col items-center justify-center h-svh w-full gap-10 '>
        <p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
          <span className='text-green-500'>go</span>treats
        </p>
        <div className='flex flex-col gap-3 items-center'>
          <h1 className='text-4xl lancelot '>Welcome {userDetails?.displayName}</h1>
          <div className='flex flex-col items-center gap-3 relative'>
            <input
              autoFocus
              type="password"
              className='bg-gray-700 py-4 pl-16 rounded-full outline-0 focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 w-74'
              placeholder='Enter Admin Password'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Key className='absolute left-7 top-7 -translate-y-1/2 text-green-400 animate-pulse' size={20} />
            <Button variant='primary' className='' type='submit'>Submit</Button>
          </div>
        </div>
      </form>
    )
  }

  // Check if the user has admin rights
  if (userDetails?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (

    <Outlet />

  )
}

export default AdminRoutes