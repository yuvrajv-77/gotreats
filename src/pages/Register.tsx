import React, { useState } from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { handleEmailAccountCreation, handlesignInWithGoogle } from '../services/authService';
import toast from 'react-hot-toast';

const Register = () => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setErrorMsg("");

        try {
            await handleEmailAccountCreation(name, email, password, phone);
            toast.success("Account created successfully");
            setEmail("");
            setPassword("");
            navigate("/")
        } catch (error) {
            console.error(error);
            setErrorMsg(error?.message);
            setError("Invalid email or password");
        }

    };

    return (
        <div className='flex justify-center items-center h-[calc(100vh-150px)]'>
            <div className=''>


                <div className="text-sm font-medium text-center  text-gray-500 border-b border-gray-300 ">
                    <ul className="flex justify-center gap-4 text-lg ">
                        <li className="me-2" onClick={() => navigate('/login')}>
                            <p className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Log In</p>
                        </li>
                        <li className="me-2" >
                            <p className="inline-block p-4 text-green-500 border-b-2 border-green-500 rounded-t-lg active " aria-current="page">Register</p>
                        </li>
                    </ul>
                </div>



                <form className='mt-4 sm:mt-10 w-74 space-y-2 sm:space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Name</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Enter your name' />
                    </div>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Phone number</p>
                        <input type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Enter your number' />
                    </div>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Email</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Enter your email' />
                    </div>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Create Password</p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Create a New password' />
                    </div>
                    {/* <div>
                        <p className='mb-2 text-orange-600 text-sm'>Address</p>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Enter your full address' />
                    </div> */}
                    {error && <p className='text-red-500 text-center'>{error} <br /> {errorMsg}</p>}
                    <Button type='submit' variant='primary' className='w-full '>Register</Button>
                    <p className='text-center'>Or</p>
                    <button type='button'
                        onClick={async () => {
                            await handlesignInWithGoogle();
                            toast.success("Login successful")
                            navigate("/");
                        }} className='w-full p-2 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center'><img src="/google.svg" className='mr-2 w-6' alt="" />Sign Up With Google</button>
                </form>

            </div>
        </div>
    )
}

export default Register