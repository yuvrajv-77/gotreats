import { AlignLeft, ShoppingCart, UserRound } from 'lucide-react'
import Button, { IconButton } from './Button'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from '../store/authStore';
import { handleLogout } from '../services/authService';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { useCartStore } from '../store/cartStore';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    const user = useAuthStore((state) => state.user)
    const userDetails = useAuthStore((state) => state.userDetails)
    const items = useCartStore((state) => state.items);
    const navigate = useNavigate();


    return (
        <nav className=' flex lg:justify-around justify-between shadow-sm p-4 lg:py-6 lg:px-0 items-center bg-white'>

            <ul className=' gap-6 hidden lg:flex'>
                <Link to={'/shop'}><li className='hover:underline cursor-pointer'>Shop</li></Link>
                <Link to={'/terms-and-conditions'}><li className='hover:underline cursor-pointer'>Terms and Conditions</li></Link>
                <Link to={'/contact'}><li className='hover:underline cursor-pointer'>Contact</li></Link>
                
                {/* <li className='hover:underline cursor-pointer'>Contact Us</li> */}
            </ul>
            <div className='flex items-center gap-3'>
                <IconButton className='lg:hidden block' onClick={() => setIsOpen((prev) => !prev)}><AlignLeft strokeWidth={1.6} /></IconButton>
                <Link to={'/'}><p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'><span className='text-green-500'>go</span>treats</p></Link>
            </div>
            <div className='flex gap-4 items-center'>

                {
                    userDetails?.phoneNumber === '7905146108' &&
                    <Button onClick={() => navigate('/admin')}>Admin</Button>
                }

                {user && <Link to={'/checkout'}>
                    <IconButton>
                        <ShoppingCart strokeWidth={1.4} />
                        <p className=' text-green-600 text-lg'>
                            {items.reduce((total, item) => total + item.quantity, 0)}
                        </p>
                    </IconButton>
                </Link>}

                {
                    user &&
                    <Dropdown>
                        <DropdownTrigger>
                            <button
                                className='cursor-pointer p-2 hover:bg-gray-100 flex justify-center gap-2 items-center rounded-full focus:bg-gray-100'>
                                <UserRound strokeWidth={1.4} />
                                <p className='hidden lg:block'>{userDetails?.displayName}</p>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions" className='bg-white shadow-xl rounded-xl p-4 border-gray-200 border'>

                            <DropdownItem className=' hover:bg-gray-100 ' key="new" onPress={() => navigate('/profile')}>Profile</DropdownItem>
                            <DropdownItem className=' hover:bg-gray-100 ' key="new" onPress={() => navigate('/Orders')}>Orders</DropdownItem>
                            <DropdownItem className=' hover:bg-gray-100 text-red-500' key="logout"
                                onPress={() => {
                                    // localStorage.removeItem('cart-storage');
                                    useCartStore.getState().clearCart();
                                    handleLogout();
                                    toast.success('Logout successful');
                                    navigate('/');
                                }}>Log Out</DropdownItem>

                        </DropdownMenu>
                    </Dropdown>
                }

                {
                    !user &&
                    <div className='flex items-center gap-4'>
                        <Link to={'/Login'}>
                            <button className='hidden lg:block'>Sign In</button>
                        </Link>
                        <Link to={'/Register'}>
                            <Button className=' '>Sign Up</Button>
                        </Link>
                    </div>
                }
            </div>
            <AnimatePresence>
                {isOpen && <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -200, opacity: 0 }}
                    className='fixed left-0 top-18 h-full w-full lg:hidden overflow-hidden backdrop-blur-xl'>

                    <ul className='h-full w-full  items-center mt-26 flex flex-col gap-20 '>
                        <li className=''>
                            <Link to={"/"} onClick={() => setIsOpen(false)} className='text-xl  px-10'>Home</Link>
                        </li>
                        <li className=''>
                            <Link to={"/shop"} onClick={() => setIsOpen(false)} className='text-xl  px-10'>Shop</Link>
                        </li>
                        <li className=''>
                            <Link to={"/terms-and-conditions"} onClick={() => setIsOpen(false)} className='text-xl  px-10'>Terms and Conditions</Link>
                        </li>
                        <li className=''>
                            <Link to={"/contact"} onClick={() => setIsOpen(false)} className='text-xl px-10'>Contact Us</Link>
                        </li>
                    </ul>
                </motion.div>}
            </AnimatePresence>
            <Toaster/>
        </nav>
    )
}

export default Navbar