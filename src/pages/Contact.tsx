import { MailIcon, Phone, Store } from 'lucide-react'
import Button from '../components/Button'
import { useState } from 'react';


const Contact = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    return (
        <div className=''>
            <div className='bg-green-200 text-center mt-10 py-10 px-5'>
                <h1 className=' lancelot text-5xl text- mb-4'>Get In Touch</h1>
                <p>Hi! 👋🏻 Its Govinda Jayprakash Shah. If you have any query just contact me</p>
            </div>
            <div className='container mx-auto flex lg:flex-row px-10 flex-col justify-evenly gap-7 lg:gap-0 mt-10'>
                <div className=' group border h-46 md:h-56 w-full lg:w-86 group flex flex-col justify-between p-6 gap-5  rounded-xl'>
                    <MailIcon size={40} strokeWidth='1.4' className='group-hover:animate-bounce' />
                    <div>
                        <h2 className='text-gray-900 text-xl tracking-tight'>Email Us</h2>
                        <p className=' text-gray-500 text-sm group-hover:whitespace-normal transition-all duration-300 ease-in-out '>Send us an email, we will get back to you.</p>
                        <p className=' text-orange-600 mt-3 group-hover:underline  group-hover:whitespace-normal transition-all duration-300 ease-in-out  '>govindashah603@gmail.com</p>
                    </div>
                </div>
                <div className=' group border h-46 md:h-56 w-full lg:w-86 group flex flex-col justify-between p-6 gap-5  rounded-xl'>
                    <Phone size={40} strokeWidth='1.4' className='group-hover:animate-bounce' />
                    <div>
                        <h2 className='text-gray-900 text-xl tracking-tight'>Call Us</h2>
                        <p className=' text-gray-500 text-sm group-hover:whitespace-normal transition-all duration-300 ease-in-out '>Prefer to talk? Give us a call at.</p>
                        <p className=' text-orange-600 mt-3 group-hover:underline  group-hover:whitespace-normal transition-all duration-300 ease-in-out  '>+91-7045617506</p>
                    </div>
                </div>

                <div className=' group border h- md:h-56 w-full lg:w-86 group flex flex-col justify-between p-6 gap-5  rounded-xl'>
                    <Store size={40} strokeWidth='1.4' className='group-hover:animate-bounce' />
                    <div>
                        <h2 className='text-gray-900 text-xl tracking-tight'>Visit Us</h2>
                        <p className=' text-gray-500 text-sm group-hover:whitespace-normal transition-all duration-300 ease-in-out '>Operational Address</p>Room No.6,Ratnabai Chawl,
                        <p className=' text-orange-600 mt-3 group-hover:underline  group-hover:whitespace-normal transition-all duration-300 ease-in-out  '> Saibaba Nagar,Behind Nehru Garden, Borivali West, 
                        Maharashtra, PIN: 400092</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-center  lg:mt-10 p-10 lg:p-0'>

                <form className='mt-4 sm:mt-10 w-74 md:w-1/3 space-y-2 sm:space-y-4 '>
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
                        <p className='mb-2 text-orange-600 text-sm'>Your Message</p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className='border border-gray-300 rounded-xl p-2 w-full' placeholder='Write your message' />
                    </div>

                    <Button type='submit' className='w-full '>Submit</Button>

                </form>
            </div>
        </div>
    )
}

export default Contact