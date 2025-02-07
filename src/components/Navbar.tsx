import { AlignLeft, ShoppingCart, UserRound } from 'lucide-react'
import Button, { IconButton } from './Button'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)
    return (
        <nav className=' flex lg:justify-around justify-between  p-4 lg:py-6 lg:px-0 items-center bg-white'>

            <ul className=' gap-6 hidden lg:flex'>
                <li className='hover:underline cursor-pointer'>Shop</li>
                <li className='hover:underline cursor-pointer'>Services</li>
                <li className='hover:underline cursor-pointer'>About Us</li>
                {/* <li className='hover:underline cursor-pointer'>Contact Us</li> */}
            </ul>
            <div className='flex items-center gap-3'>
                <IconButton className='lg:hidden block' onClick={() => setIsOpen((prev) => !prev)}><AlignLeft strokeWidth={1.6}  /></IconButton>
                <p className='comfortaa font-medium text-2xl lg:text-3xl text-orange-600'>govinda</p>
            </div>
            <div className='flex gap-4 items-center'>
                <IconButton>
                    <ShoppingCart strokeWidth={1.4} />
                </IconButton>
                <IconButton>
                    <UserRound strokeWidth={1.4} />
                </IconButton>
                <Button className='hidden lg:block'>Contact Us</Button>
            </div>
            <AnimatePresence>
                {isOpen && <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -200, opacity: 0 }}
                    className='fixed left-0 top-18 h-full w-full lg:hidden overflow-hidden backdrop-blur-xl'>
                    
                    <ul className='h-full w-full  items-center mt-26 flex flex-col gap-20 '>
                        <li className=''>
                            <Link to={"#home"} onClick={() => setIsOpen(false)} className='text-xl  px-10'>Home</Link>
                        </li>
                        <li className=''>
                            <Link to={"#aboutme"} onClick={() => setIsOpen(false)} className='text-xl  px-10'>Shop</Link>
                        </li>
                        <li className=''>
                            <Link to={"#techstack"} onClick={() => setIsOpen(false)} className='text-xl  px-10'>About Us</Link>
                        </li>
                        <li className=''>
                            <Link to={"#projects"} onClick={() => setIsOpen(false)} className='text-xl px-10'>Contact Us</Link>
                        </li>
                    </ul>
                </motion.div>}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar