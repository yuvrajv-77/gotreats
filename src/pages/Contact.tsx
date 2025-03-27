import { MailIcon, Phone, Store } from 'lucide-react'
import Button from '../components/Button'
import { useState } from 'react';
import { useFormspark } from "@formspark/use-formspark";
import toast from 'react-hot-toast';

const Contact = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const [submit, submitting] = useFormspark({
        formId: import.meta.env.VITE_FORMSPARK_ID,
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        await submit({ name, phone, email, message });
        toast.success("Message Sent Successfully");
        setEmail("");
        setName("");
        setPhone("");
        setMessage("");
    }

    return (
        <div className=''>
            <div className='bg-green-200 text-center mt-10 py-10 px-5'>
                <h1 className='lancelot text-5xl mb-4'>Get In Touch</h1>
                <p>Hi! 👋🏻 It's Govinda Jayprakash Shah. If you have any query just contact me</p>
            </div>

            <div className='container mx-auto flex lg:flex-row px-10 flex-col justify-evenly gap-7 lg:gap-0 mt-10'>
                <div className='group border h-46 md:h-56 w-full lg:w-86 flex flex-col justify-between p-6 gap-5 rounded-xl'>
                    <MailIcon size={40} strokeWidth='1.4' className='group-hover:animate-bounce' />
                    <div>
                        <h2 className='text-gray-900 text-xl tracking-tight'>Email Us</h2>
                        <p className='text-gray-500 text-sm'>Send us an email, we will get back to you.</p>
                        <p className='text-orange-600 mt-3 group-hover:underline'>govindashah603@gmail.com</p>
                    </div>
                </div>

                <div className='group border h-46 md:h-56 w-full lg:w-86 flex flex-col justify-between p-6 gap-5 rounded-xl'>
                    <Phone size={40} strokeWidth='1.4' className='group-hover:animate-bounce' />
                    <div>
                        <h2 className='text-gray-900 text-xl tracking-tight'>Call Us</h2>
                        <p className='text-gray-500 text-sm'>Prefer to talk? Give us a call at.</p>
                        <p className='text-orange-600 mt-3 group-hover:underline'>+91-7045617506</p>
                    </div>
                </div>

                <div className='group border h-auto md:h-56 w-full lg:w-86 flex flex-col justify-between p-6 gap-5 rounded-xl'>
                    <Store size={40} strokeWidth='1.4' className='group-hover:animate-bounce' />
                    <div>
                        <h2 className='text-gray-900 text-xl tracking-tight'>Visit Us</h2>
                        <p className='text-black text-sm'>Operational Address</p>
                        <p className='text-orange-600 mt-3 group-hover:underline'>
                            Room No.6, Ratnabai Chawl, Saibaba Nagar, Behind Nehru Garden, Borivali West, Maharashtra, PIN: 400092
                        </p>
                    </div>
                </div>
            </div>

            <div className='flex justify-center lg:mt-10 p-10 lg:p-0'>
                <form className='mt-4 sm:mt-10 w-74 md:w-1/3 space-y-2 sm:space-y-4' onSubmit={onSubmit}>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Name</p>
                        <input
                            type="text"
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)}
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Enter your name'
                        />
                    </div>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Phone number</p>
                        <input
                            type="number"
                            value={phone}
                            required
                            onChange={(e) => setPhone(e.target.value)}
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Enter your number'
                        />
                    </div>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Email</p>
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Enter your email'
                        />
                    </div>
                    <div>
                        <p className='mb-2 text-orange-600 text-sm'>Your Message</p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            required
                            className='border border-gray-300 rounded-xl p-2 w-full'
                            placeholder='Write your message'
                        />
                    </div>
                    <div className="w-full mt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full flex justify-center items-center gap-2 py-3 px-6 rounded-md font-semibold text-lg relative overflow-hidden
                            ${submitting ? 'text-gray-500 cursor-not-allowed' : 'text-[#111] cursor-pointer group'}`}
                        >
                            <p className="relative">
                                <span className="before:content-['Submit'] before:absolute before:inset-0 before:w-0 before:overflow-hidden before:text-[#c84747] before:transition-all before:duration-300 group-hover:before:w-full">
                                    Submit
                                </span>
                            </p>
                            <svg
                                className="w-[16px] transition-all duration-200 delay-200 group-hover:translate-x-1 group-hover:text-[#c84747]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="absolute bottom-[-7px] left-0 h-[2px] w-0 bg-[#c84747] transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    </div>
                </form>
            </div>

            {/* ✅ Fixed WhatsApp Button */}
            <a
                href="https://wa.me/917045617506"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 group"
                aria-label="Chat on WhatsApp"
            >
                <div className="relative flex flex-col items-center">

                    {/* Tooltip Text - Appears Above */}
                    <div className="mb-2 px-3 py-1 text-sm text-white bg-black rounded-md shadow-md opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300">
                        WhatsApp
                    </div>

                    {/* WhatsApp Icon Button */}
                    <div className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg transition-transform duration-200 transform active:scale-95">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                        >
                            <path d="M20.52 3.48a11.83 11.83 0 0 0-16.7 0 11.83 11.83 0 0 0-2.56 12.77L0 24l7.9-2.08a11.82 11.82 0 0 0 12.62-2.54 11.83 11.83 0 0 0 0-16.7Zm-4.44 12.8c-.2.56-1.15 1.06-1.6 1.1-.41.03-.9.06-1.45-.1a11.49 11.49 0 0 1-1.9-.67c-3.34-1.43-5.53-5.04-5.7-5.28-.17-.25-1.36-1.8-1.36-3.44 0-1.63.86-2.43 1.16-2.75.28-.3.74-.45 1.2-.45.14 0 .27.01.38.02.34.02.5.03.72.56.28.66.94 2.3 1.02 2.47.08.17.14.4.02.65a5.76 5.76 0 0 1-.47.79c-.22.3-.46.68-.2 1.11.25.43 1.11 1.85 2.39 3a9.1 9.1 0 0 0 3.06 1.67c.43.12.77.1 1.06-.15.27-.23.46-.6.65-.96.17-.34.37-.39.62-.26.26.13 1.62.77 1.9.9.28.14.46.21.53.32.07.11.07.63-.14 1.2Z" />
                        </svg>
                    </div>
                </div>
            </a>

        </div>
    )
}

export default Contact;
