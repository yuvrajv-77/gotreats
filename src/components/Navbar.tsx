import { Menu, X, ShoppingCart, UserRound, LogOut, AlertTriangle, Box, CircleHelp, ExternalLink, UserRoundCog } from 'lucide-react'
import Button, { IconButton } from './Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from '../store/authStore';
import { handleLogout } from '../services/authService';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useCartStore } from '../store/cartStore';
import toast, { Toaster } from 'react-hot-toast';
import Modal from './Modal';

export const BrandLogo = () => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate('/')} className="cursor-pointer select-none">
            <span className='font-heading text-xl tracking-tight'>
                <span className='text-[var(--brand-flame)]'>Bite</span>
                <span className='text-[var(--brand-cream)]'>box</span>
            </span>
        </div>
    )
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const user = useAuthStore((state) => state.user)
    const userDetails = useAuthStore((state) => state.userDetails)
    const items = useCartStore((state) => state.items);
    const navigate = useNavigate();
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    const handleLogoutClick = async () => {
        try {
            useCartStore.getState().clearCart();
            await handleLogout();
            toast.success('Logged out');
            navigate('/');
            setShowLogoutModal(false);
        } catch (error) {
            toast.error('Failed to logout.');
        }
    };

    const navLinks = [
        { to: '/shop', label: 'Menu' },
        { to: '/concept', label: 'Concept' },
        { to: '/about', label: 'About' },
        { to: '/customers', label: 'Reviews' },
    ];

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--brand-dark)]/95 backdrop-blur-md border-b border-[var(--brand-border)]' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Left — Mobile menu + Logo */}
                        <div className='flex items-center gap-3'>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden p-2 rounded-lg text-[var(--brand-cream)]/70 hover:text-[var(--brand-cream)] hover:bg-white/5 transition-colors"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <BrandLogo />
                        </div>

                        {/* Center — Nav links */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`font-mono text-xs uppercase tracking-widest hover-underline transition-colors ${location.pathname === to ? 'text-[var(--brand-flame)]' : 'text-[var(--brand-cream)]/60 hover:text-[var(--brand-cream)]'}`}
                                >
                                    {label}
                                </Link>
                            ))}
                            {userDetails?.role === 'admin' && (
                                <Link
                                    to="https://admin.gotreats.in"
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs uppercase tracking-widest text-[var(--brand-amber)]/70 hover:text-[var(--brand-amber)] flex items-center gap-1 transition-colors"
                                >
                                    Admin <ExternalLink size={10} />
                                </Link>
                            )}
                        </nav>

                        {/* Right — Actions */}
                        <div className="flex items-center gap-2">
                            {!user && (
                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-4 py-1.5 rounded-full bg-[var(--brand-flame)] text-white font-heading text-sm font-semibold hover:bg-[#C94808] transition-colors"
                                >
                                    Sign Up
                                </button>
                            )}

                            {user && (
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="relative p-2 rounded-xl text-[var(--brand-cream)]/70 hover:text-[var(--brand-cream)] hover:bg-white/5 transition-colors"
                                >
                                    <ShoppingCart size={20} strokeWidth={1.5} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--brand-flame)] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center px-0.5">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {user && (
                                <Dropdown>
                                    <DropdownTrigger>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--brand-border)] hover:border-[var(--brand-flame)]/40 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--brand-flame)] to-[var(--brand-amber)] flex items-center justify-center">
                                                <UserRound size={12} className="text-white" />
                                            </div>
                                            <span className="hidden lg:block text-xs font-mono text-[var(--brand-cream)]/70 max-w-[100px] truncate">
                                                {userDetails?.displayName?.split(' ')[0]}
                                            </span>
                                        </button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="User menu"
                                        className="bg-[var(--brand-charcoal)] border border-[var(--brand-border)] rounded-xl shadow-2xl"
                                    >
                                        <DropdownItem key="profile" onPress={() => navigate('/profile')} className="text-[var(--brand-cream)]/80 hover:text-[var(--brand-cream)] hover:bg-white/5">
                                            <div className="flex items-center gap-2 py-0.5">
                                                <UserRound size={14} className="text-[var(--brand-muted)]" />
                                                <span className="font-body text-sm">Profile</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem key="orders" onPress={() => navigate('/orders')} className="text-[var(--brand-cream)]/80 hover:text-[var(--brand-cream)] hover:bg-white/5">
                                            <div className="flex items-center gap-2 py-0.5">
                                                <Box size={14} className="text-[var(--brand-muted)]" />
                                                <span className="font-body text-sm">My Orders</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem key="help" onPress={() => navigate('/contact')} className="text-[var(--brand-cream)]/80 hover:text-[var(--brand-cream)] hover:bg-white/5">
                                            <div className="flex items-center gap-2 py-0.5">
                                                <CircleHelp size={14} className="text-[var(--brand-muted)]" />
                                                <span className="font-body text-sm">Help</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="logout"
                                            onPress={() => setShowLogoutModal(true)}
                                            className="text-red-400 hover:bg-red-500/10"
                                        >
                                            <div className="flex items-center gap-2 py-0.5">
                                                <LogOut size={14} />
                                                <span className="font-body text-sm">Log Out</span>
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: '100dvh' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden bg-[var(--brand-dark)] border-t border-[var(--brand-border)]"
                        >
                            <div className="flex flex-col px-6 py-10 gap-8 h-full">
                                <nav className="flex flex-col gap-6">
                                    {[
                                        { to: '/', label: 'Home' },
                                        { to: '/shop', label: 'Menu' },
                                        { to: '/profile', label: 'Profile' },
                                        { to: '/orders', label: 'Orders' },
                                        { to: '/about', label: 'About' },
                                        { to: '/customers', label: 'Reviews' },
                                        { to: '/contact', label: 'Contact' },
                                        { to: '/concept', label: 'Concept' },
                                    ].map(({ to, label }) => (
                                        <Link
                                            key={to}
                                            to={to}
                                            onClick={() => setIsOpen(false)}
                                            className="font-heading text-3xl text-[var(--brand-cream)]/80 hover:text-[var(--brand-flame)] transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="mt-auto">
                                    {user ? (
                                        <button
                                            onClick={() => { setShowLogoutModal(true); setIsOpen(false); }}
                                            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-heading font-semibold hover:bg-red-500/10 transition-colors"
                                        >
                                            Log Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { navigate('/register'); setIsOpen(false); }}
                                            className="w-full py-3 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold hover:bg-[#C94808] transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <Modal
                isOpen={showLogoutModal}
                title="Confirm Logout"
                message='Are you sure you want to log out?'
                onConfirm={handleLogoutClick}
                onCancel={() => setShowLogoutModal(false)}
                confirmLabel="Log Out"
                cancelLabel="Cancel"
            />
            <Toaster />
        </>
    )
}

export default Navbar