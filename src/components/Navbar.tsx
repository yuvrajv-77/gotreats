import { Menu, X, ShoppingCart, UserRound, MapPin, LogOut, AlertTriangle, Box, CircleHelp } from 'lucide-react'
import Button, { IconButton } from './Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from '../store/authStore';
import { handleLogout } from '../services/authService';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useCartStore } from '../store/cartStore';
import toast, { Toaster } from 'react-hot-toast';
import DeliveryAreaChecker from './DeliveryAreaChecker';
import Modal from './Modal';

export const BrandLogo = () => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate('/')} className="cursor-pointer">
            <p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
                <span className='text-green-500'>go</span>treats
            </p>
        </div>
    )
}
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showDeliveryChecker, setShowDeliveryChecker] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const user = useAuthStore((state) => state.user)
    const userDetails = useAuthStore((state) => state.userDetails)
    const items = useCartStore((state) => state.items);
    const navigate = useNavigate();

    // Prevent background scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Function to handle navigation and close the mobile menu
    const handleNavigation = (path: string) => {
        setIsOpen(false)
        navigate(path)
    };

    const handleLogoutClick = async () => {
        try {
            useCartStore.getState().clearCart();
            await handleLogout();
            toast.success('Logged out successfully');
            navigate('/');
            setShowLogoutModal(false);
        } catch (error) {
            toast.error('Failed to logout. Please try again.');
        }
    };

    // Add a function to check if a link is active
    const isLinkActive = (path: string) => {
        return location.pathname === path;
    };


    return (
        <>
            <header className=" py-2  w-full  z-50 ">
                <div className="container  mx-auto">
                    <div className="border bg-whitebackdrop-blur-md border-white/20 ">
                        <div className=" grid grid-cols-2 lg:grid-cols-3 px-4 md:pr-2 py-2  items-center">
                            <div className='flex items-center gap-2'>
                                <span onClick={() => setIsOpen(!isOpen)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-menu md:hidden"
                                    >
                                        <line x1="3" y1="6" x2="21" y2="6" className={`origin-left transition ${isOpen ? "rotate-45 -translate-y-1" : ""}`}></line>
                                        <line x1="3" y1="12" x2="21" y2="12" className={isOpen ? "opacity-0 transition" : "transition"}></line>
                                        <line x1="3" y1="18" x2="21" y2="18" className={`origin-left transition ${isOpen ? "-rotate-45 translate-y-1" : ""}`}></line>
                                    </svg>
                                </span>
                                <BrandLogo />
                            </div>
                            <div className="hidden lg:block">
                                <nav className="flex gap-10 items-center justify-center">
                                    <Link to="/shop" className="hover:text-green-600">Menu</Link>
                                    <Link to="/concept" className="hover:text-green-600">Concept</Link>
                                    <Link to="/about" className="hover:text-green-600">About</Link>
                                    <Link to="/customers" className="hover:text-green-600">Customers</Link>
                                    <Link to="/contact" className="hover:text-green-600">Contact</Link>
                                </nav>
                            </div>
                            <div className="flex justify-end gap-4">
                                {!user && (
                                    <Button variant='primary' className='' onClick={() => navigate('/register')}>Sign Up</Button>
                                )}
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
                                            <Button variant='secondary' >
                                                <div className='flex items-center gap-2'>
                                                    <UserRound strokeWidth={1.4} />
                                                    <p className='hidden lg:block'>{userDetails?.displayName}</p>
                                                </div>
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Static Actions" >
                                            <DropdownItem
                                                className='hover:bg-gray-100'
                                                key="profile"
                                                onPress={() => navigate('/profile')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <UserRound size={16} />
                                                    Profile
                                                </div>
                                            </DropdownItem>
                                            <DropdownItem key="orders" onPress={() => navigate('/orders')}>
                                                <div className="flex items-center gap-2">
                                                    <Box size={16} />
                                                    Orders
                                                </div>
                                            </DropdownItem>
                                            <DropdownItem key="orders" onPress={() => navigate('/contact')}>
                                                <div className="flex items-center gap-2">
                                                    <CircleHelp size={16} />
                                                    Help
                                                </div>
                                            </DropdownItem>
                                            <DropdownItem
                                                className='hover:bg-gray-100 text-red-500'
                                                key="logout"
                                                onPress={() => setShowLogoutModal(true)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <LogOut size={16} />
                                                    Log Out
                                                </div>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                }

                            </div>
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "100dvh" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden">
                                    <div className="flex flex-col gap-10 items-center justify-center px-10 py-10 ">
                                        <nav className="flex flex-col gap-15 items-center justify-center">
                                            <Link to="/" onClick={() => setIsOpen(false)} className={`text-lg `}>Home</Link>
                                            <Link to="/shop" onClick={() => setIsOpen(false)} className={`text-lg `}>Shop</Link>
                                            <Link to="/terms-and-conditions" onClick={() => setIsOpen(false)} className={`text-lg `}>Terms and Conditions</Link>
                                            <Link to="/about" onClick={() => setIsOpen(false)} className={`text-lg `}>About</Link>
                                            <Link to="/customers" onClick={() => setIsOpen(false)} className={`text-lg `}>Customers</Link>
                                            <Link to="/contact" onClick={() => setIsOpen(false)} className={`text-lg `}>Contact Us</Link>
                                            <Link to="/concept" onClick={() => setIsOpen(false)} className={`text-lg `}>Concept</Link>
                                        </nav>
                                        <div className="space-y-4 w-full">

                                            {user ?
                                                <Button variant='danger' className='w-full' onClick={() => setShowLogoutModal(true)}>Log Out</Button> :
                                                <Button variant='primary' className='w-full' onClick={() => navigate('/register')}>Sign Up</Button>
                                            }
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>
            <Modal
                isOpen={showLogoutModal}
                title="Confirm Logout"
                message='Are you sure you want to log out?'
                onConfirm={handleLogoutClick}
                onCancel={() => setShowLogoutModal(false)}
                confirmLabel="Yes, Log Out"
                cancelLabel="Cancel"
            />

            <Toaster />
        </>
    )
}

export default Navbar