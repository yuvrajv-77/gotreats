import React, { useState } from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { handleEmailAccountLogin, handlesignInWithGoogle } from '../services/authService'
import { useAuthStore } from '../store/authStore'

const Login = () => {
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const user = useAuthStore((state) => state.user)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await handleEmailAccountLogin( email, password);
            navigate("/")
        } catch (error) {
            console.error(error?.message);
            setErrorMsg(error?.message);
            setError("Invalid email or password");
        }
    };

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



        <form className='mt-10 w-74 space-y-4' onSubmit={handleSubmit}>
            <div>
                <p className='mb-2 text-orange-600 text-sm'>Email</p>
                <input type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Enter your Email' />
            </div>
            <div>
                <p className='mb-2 text-orange-600 text-sm'>Password</p>
                <input type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Enter your password' />
            </div>
            {/* <div>
                <p className='mb-2 text-orange-600 text-sm'>Address</p>
                <textarea rows={3} className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Enter your full address' />
            </div> */}
            {error && <p className='text-red-500 text-center'>{error} <br/> {errorMsg}</p>}
            <Button type='submit' className='w-full '>Log In</Button>
            <p className='text-center'>Or</p>
        </form>
            <button type='button'  onClick={() => {handlesignInWithGoogle(); navigate("/")}} className='w-full p-2 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center'><img src="/google.svg" className='mr-2 w-6' alt="" />Sign Up With Google</button>

    </div>
</div>
  )
}

export default Login