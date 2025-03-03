import React from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { handlesignInWithGoogle } from '../services/authService'
import { useAuthStore } from '../store/authStore'

const Login = () => {
    const user = useAuthStore((state) => state.user)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
    }

    const navigate = useNavigate()

    console.log("google login",user);
    
  return (
    <div className='flex justify-center items-center h-[calc(100vh-150px)]'>
    <div className=''>


        <div className="text-sm font-medium text-center  text-gray-500 border-b border-gray-300 ">
            <ul className="flex justify-center gap-4 text-lg ">
                <li className="me-2">
                    <p className="inline-block p-4 text-green-500 border-b-2 border-green-500 rounded-t-lg active " aria-current="page">Login</p>
                </li>
                <li className="me-2" onClick={() => navigate('/register')}>
                    <p className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ">Register</p>
                </li>
            </ul>
        </div>



        <form className='mt-10 w-74 space-y-4'>
            <div>
                <p className='mb-2 text-orange-600 text-sm'>Email</p>
                <input type="email" className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Enter your Email' />
            </div>
            <div>
                <p className='mb-2 text-orange-600 text-sm'>Password</p>
                <input type="password" className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Enter your password' />
            </div>
            {/* <div>
                <p className='mb-2 text-orange-600 text-sm'>Address</p>
                <textarea rows={3} className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Enter your full address' />
            </div> */}
            <Button type='submit' className='w-full '>Log In</Button>
            <p className='text-center'>Or</p>
            <button type='button' onClick={() => handlesignInWithGoogle()} className='w-full p-2 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center'><img src="/google.svg" className='mr-2 w-6' alt="" />Sign Up With Google</button>
        </form>

    </div>
</div>
  )
}

export default Login