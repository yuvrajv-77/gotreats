import {  MailIcon, Phone, Store } from 'lucide-react'


const Contact = () => {
    return (
        <div className=''>
            <div className='bg-orange-300 text-center mt-10 py-10 px-5'>
                <h1 className=' lancelot text-5xl text-white mb-4'>Get In Touch</h1>
                <p>Talk to us about your needs and we'll get back to you as soon as possible</p>
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

            </div>

            <div className='flex justify-center  lg:mt-10 p-10 lg:p-0'>

                <div className=' group border h-46 md:h-56 w-full lg:w-86 group flex flex-col justify-between p-6 gap-5  rounded-xl'>
                    <Store size={40} strokeWidth='1.4' className='group-hover:animate-bounce' />
                    <div>
                        <h2 className='text-gray-900 text-xl tracking-tight'>Visit Us</h2>
                        <p className=' text-gray-500 text-sm group-hover:whitespace-normal transition-all duration-300 ease-in-out '>Prefer to talk? Give us a call at.</p>
                        <p className=' text-orange-600 mt-3 group-hover:underline  group-hover:whitespace-normal transition-all duration-300 ease-in-out  '>+91-7045617506</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact