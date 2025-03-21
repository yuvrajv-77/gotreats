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

    // Function to handle navigation and close the mobile menu
    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <nav className='flex fixed top-0 left-0 w-full lg:justify-around justify-between shadow-sm p-4 lg:py-6 lg:px-0 items-center bg-white z-10 '>
            <ul className='gap-6 hidden lg:flex'>
                <li className='hover:underline cursor-pointer' onClick={() => navigate('/shop')}>
                    <Link to='/shop'>Shop</Link>
                </li>
                <li className='hover:underline cursor-pointer' onClick={() => navigate('/concept')}>
                    <Link to='/concept'>Concept</Link>
                </li>
                <li className='hover:underline cursor-pointer' onClick={() => navigate('/about')}>
                    <Link to='/about'>About</Link>
                </li>
                <li className='hover:underline cursor-pointer' onClick={() => navigate('/contact')}>
                    <Link to='/contact'>Contact</Link>
                </li>
            </ul>
            <div className='flex items-center gap-3'>
                <IconButton className='lg:hidden block' onClick={() => setIsOpen((prev) => !prev)}>
                    <AlignLeft strokeWidth={1.6} />
                </IconButton>
                <div onClick={() => navigate('/')} className="cursor-pointer">
                    <p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
                        <span className='text-green-500'>go</span>treats
                    </p>
                </div>
            </div>
            <div className='flex gap-4 items-center'>
                {userDetails?.phoneNumber === '7905146108' &&
                    <Button onClick={() => navigate('/admin/view-all-products')}>Admin</Button>
                }

                {user && 
                    <div onClick={() => navigate('/checkout')} className="cursor-pointer">
                        <IconButton>
                            <ShoppingCart strokeWidth={1.4} />
                            <p className='text-green-600 text-lg'>
                                {items.reduce((total, item) => total + item.quantity, 0)}
                            </p>
                        </IconButton>
                    </div>
                }

                {user &&
                    <Dropdown>
                        <DropdownTrigger>
                            <button className='cursor-pointer p-2 hover:bg-gray-100 flex justify-center gap-2 items-center rounded-full focus:bg-gray-100'>
                                <UserRound strokeWidth={1.4} />
                                <p className='hidden lg:block'>{userDetails?.displayName}</p>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions" className='bg-white shadow-xl rounded-xl p-4 border-gray-200 border'>
                            <DropdownItem className='hover:bg-gray-100' key="new" onPress={() => navigate('/profile')}>Profile</DropdownItem>
                            <DropdownItem className='hover:bg-gray-100' key="new" onPress={() => navigate('/Orders')}>Orders</DropdownItem>
                            <DropdownItem className='hover:bg-gray-100 text-red-500' key="logout"
                                onPress={() => {
                                    useCartStore.getState().clearCart();
                                    handleLogout();
                                    toast.success('Logout successful');
                                    navigate('/');
                                }}>Log Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                }

                {!user &&
                    <div className='flex items-center gap-4'>
                        <div onClick={() => navigate('/Login')} className="hidden lg:block cursor-pointer">
                            <button>Sign In</button>
                        </div>
                        <div onClick={() => navigate('/Register')} className="cursor-pointer">
                            <Button className=''>Sign Up</Button>
                        </div>
                    </div>
                }
            </div>
            
            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: -200, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -200, opacity: 0 }}
                        className='fixed left-0 top-18 h-full w-full lg:hidden overflow-hidden bg-white z-30'
                    >
                        <ul className='h-full w-full items-center mt-26 flex flex-col gap-10'>
                            <li className='w-full text-center'>
                                <button 
                                    className='text-xl px-10 py-4 w-full' 
                                    onClick={() => handleNavigation('/')}
                                >
                                    Home
                                </button>
                            </li>
                            <li className='w-full text-center'>
                                <button 
                                    className='text-xl px-10 py-4 w-full' 
                                    onClick={() => handleNavigation('/shop')}
                                >
                                    Shop
                                </button>
                            </li>
                            <li className='w-full text-center'>
                                <button 
                                    className='text-xl px-10 py-4 w-full' 
                                    onClick={() => handleNavigation('/terms-and-conditions')}
                                >
                                    Terms and Conditions
                                </button>
                            </li>
                            <li className='w-full text-center'>
                                <button 
                                    className='text-xl px-10 py-4 w-full' 
                                    onClick={() => handleNavigation('/contact')}
                                >
                                    Contact Us
                                </button>
                            </li>
                            <li className='w-full text-center'>
                                <button 
                                    className='text-xl px-10 py-4 w-full' 
                                    onClick={() => handleNavigation('/concept')}
                                >
                                    Concept
                                </button>
                            </li>
                            <li className='w-full text-center'>
                                <button 
                                    className='text-xl px-10 py-4 w-full' 
                                    onClick={() => handleNavigation('/about')}
                                >
                                    About
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
            <Toaster/>
        </nav>
    )
}

export default Navbar