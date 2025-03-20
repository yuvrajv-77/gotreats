import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import Button from '../components/Button'

const PASS = 'kl45i'
const AdminRoutes = () => {
  const { userDetails } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === PASS) {
      setIsLoading(false)
      setIsAuthenticated(true)
    }
  }

  if (isLoading) {
    return (
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center h-screen w-full gap-3 border'>
        <p>ADMIN PASSWORD</p>
        <input 
          autoFocus 
          type="password" 
          className='bg-green-200 p-4 rounded-xl focus:ring-2 focus:ring-green-400 w-64' 
          placeholder='🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑' 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <Button type='submit'>Submit</Button>
        <img src="https://media1.tenor.com/m/DfSs6KiP6-kAAAAC/akshay-kumar-smile.gif" alt="Akshay Kumar smiling" />
      </form>
    )
  }

  if (!isAuthenticated || userDetails?.phoneNumber !== '7905146108') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoutes