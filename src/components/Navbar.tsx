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

    const menuItems = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/terms-and-conditions', label: 'Terms and Conditions' },
        { path: '/about', label: 'About' },
        { path: '/customers', label: 'Customers' },
        { path: '/contact', label: 'Contact Us' },
        { path: '/concept', label: 'Concept' },
    ]

    return (
        <>
            <nav className='flex fixed top-0 left-0 w-full lg:justify-around justify-between shadow-sm px-3 py-2 lg:py-3 lg:px-0 items-center bg-white z-[40]'>
                <ul className='gap-6 hidden lg:flex'>
                    <li className='relative group nav-item'>
                        <Link to='/shop' className={`py-2 px-1 inline-block overflow-hidden ${isLinkActive('/shop') ? 'nav-link-active' : ''}`}>
                            <span className='relative z-10 text-gray-800 group-hover:text-green-600 transition-colors duration-300'>Shop</span>
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300'></span>
                        </Link>
                    </li>
                    <li className='relative group nav-item'>
                        <Link to='/concept' className={`py-2 px-1 inline-block overflow-hidden ${isLinkActive('/concept') ? 'nav-link-active' : ''}`}>
                            <span className='relative z-10 text-gray-800 group-hover:text-green-600 transition-colors duration-300'>Concept</span>
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300'></span>
                        </Link>
                    </li>
                    <li className='relative group nav-item'>
                        <Link to='/about' className={`py-2 px-1 inline-block overflow-hidden ${isLinkActive('/about') ? 'nav-link-active' : ''}`}>
                            <span className='relative z-10 text-gray-800 group-hover:text-green-600 transition-colors duration-300'>About</span>
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300'></span>
                        </Link>
                    </li>
                    <li className='relative group nav-item'>
                        <Link to='/customers' className={`py-2 px-1 inline-block overflow-hidden ${isLinkActive('/customers') ? 'nav-link-active' : ''}`}>
                            <span className='relative z-10 text-gray-800 group-hover:text-green-600 transition-colors duration-300'>Customers</span>
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300'></span>
                        </Link>
                    </li>
                    <li className='relative group nav-item'>
                        <Link to='/contact' className={`py-2 px-1 inline-block overflow-hidden ${isLinkActive('/contact') ? 'nav-link-active' : ''}`}>
                            <span className='relative z-10 text-gray-800 group-hover:text-green-600 transition-colors duration-300'>Contact</span>
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300'></span>
                        </Link>
                    </li>
                </ul>
                <div className='flex items-center gap-8'>
                    <IconButton className='lg:hidden block cursor-thumb' onClick={() => setIsOpen((prev) => !prev)}>
                        {isOpen ? (
                            <X strokeWidth={1.6} className="transition-transform duration-300" />
                        ) : (
                            <Menu strokeWidth={1.6} className="transition-transform duration-300" />
                        )}
                    </IconButton>
                    <div onClick={() => navigate('/')} className="cursor-pointer">
                        <p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
                            <span className='text-green-500'>go</span>treats
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDeliveryChecker(true)}
                        className="hidden lg:flex items-center gap-2 border border-gray-200 rounded-md px-4 py-2 hover:border-green-500 hover:bg-green-50/50 transition-all duration-300 cursor-pointer group"
                    >
                        <span className="text-gray-600 group-hover:text-green-600 transition-colors">Check Our Delivery Areas</span>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm group-hover:bg-green-600 transition-colors">Check</span>
                    </button>
                </div>
                <div className='flex gap-4 items-center'>
                    {userDetails?.role === 'admin' &&
                        <Button variant='primary' className='hidden lg:block' onClick={() => navigate('/admin/view-all-products')}>Admin</Button>
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
                                <Button variant='secondary' className='bg-wh' >
                                    <UserRound strokeWidth={1.4} />
                                    <p className='hidden lg:block'>{userDetails?.displayName}</p>
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

                    {!user &&
                        <div className='flex items-center gap-4'>
                            <div onClick={() => navigate('/Login')} className="hidden lg:block cursor-pointer">
                                <button className="nav-signin">Sign In</button>
                            </div>
                            <div onClick={() => navigate('/Register')} className="cursor-pointer">
                                <button className="nav-signup">Sign Up</button>
                            </div>
                        </div>
                    }
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 bg-black z-[90]'
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed left-0 top-[72px] h-[calc(100vh-72px)] w-full lg:hidden bg-black z-[95]'
                        >
                            <motion.ul
                                className='h-full w-full flex flex-col justify-start pt-16 gap-5 items-center'
                                initial="closed"
                                animate="open"
                                variants={{
                                    open: {
                                        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                                    },
                                    closed: {
                                        transition: { staggerChildren: 0.05, staggerDirection: -1 }
                                    }
                                }}
                            >
                                <motion.li
                                    className='w-full text-center'
                                    variants={{
                                        open: {
                                            y: 0,
                                            opacity: 1,
                                            transition: { type: "spring", stiffness: 300, damping: 24 }
                                        },
                                        closed: { y: 20, opacity: 0 }
                                    }}
                                >
                                    <button
                                        className="flex items-center justify-center gap-2 w-[80%] mx-auto border border-gray-700 rounded-md px-4 py-3 text-white hover:bg-white/10 transition-colors"
                                        onClick={() => setShowDeliveryChecker(true)}
                                    >
                                        <MapPin size={18} className="text-green-500" />
                                        <span>Check Our Delivery Areas</span>
                                        <span className="bg-green-500 px-3 py-1 rounded-md text-sm">Check</span>
                                    </button>
                                </motion.li>
                                {menuItems.map((item) => (
                                    <motion.li
                                        key={item.path}
                                        className='w-full text-center'
                                        variants={{
                                            open: {
                                                y: 0,
                                                opacity: 1,
                                                transition: { type: "spring", stiffness: 300, damping: 24 }
                                            },
                                            closed: { y: 20, opacity: 0 }
                                        }}
                                    >
                                        <button
                                            className={`text-xl px-10 py-3 w-full transition-all duration-300 rounded-lg font-medium cursor-pointer text-white
                                            hover:bg-white/10`}
                                            onClick={() => handleNavigation(item.path)}
                                        >
                                            {item.label}
                                        </button>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Delivery Area Checker Modal */}
            <DeliveryAreaChecker
                isOpen={showDeliveryChecker}
                onClose={() => setShowDeliveryChecker(false)}
                setMobileMenuOpen={setIsOpen}
            />

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