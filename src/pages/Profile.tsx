import React, { useEffect } from 'react'
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { handleLogout, updateUserAddress, updateUserPhone } from '../services/authService';
import { Mail, Phone, LogOut, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import AddressSection from '../components/AddressSection';
import Modal from '../components/Modal';


const Profile = () => {
    const navigate = useNavigate()
    const userDetails = useAuthStore((state) => state.userDetails)
    const [address, setAddress] = React.useState(userDetails?.address || '');
    const [phoneNumber, setPhoneNumber] = React.useState(userDetails?.phoneNumber || '');
    const [isEditingPhone, setIsEditingPhone] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    // Keep address in sync with userDetails
    React.useEffect(() => {
        setAddress(userDetails?.address || '');
    }, [userDetails?.address]);

    useEffect(() => {
        window.scrollTo(0, 0);
    })
    const handleLogoutClick = async () => {
        try {
            await handleLogout();
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to logout. Please try again.');
        }
    };

    const handleAddressSubmit = async () => {
        if (!address.trim()) {
            toast.error('Please enter an address');
            return;
        }

        try {
            setLoading(true);
            if (!userDetails?.uid) {
                toast.error('Please log in to save address');
                return;
            }

            await updateUserAddress(userDetails.uid, address.trim());
            toast.success('Address saved successfully!');
        } catch (error) {
            console.error("Failed to update address:", error);
            toast.error('Failed to save address. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handlePhoneSubmit = async () => {
        try {
            setLoading(true);
            if (userDetails?.uid) {
                await updateUserPhone(userDetails.uid, phoneNumber);
                setIsEditingPhone(false);
                toast.success('Phone number updated successfully!');
            }
        } catch (error) {
            console.error("Failed to update phone:", error);
            toast.error('Failed to update phone number');
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[var(--brand-dark)]">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl text-[var(--brand-cream)]">Profile</h1>
                    <p className="font-mono text-xs text-[var(--brand-cream)]/30 mt-2 tracking-widest uppercase">Manage your account details and address</p>
                </div>

                <section className="bg-[var(--brand-charcoal)] border border-[var(--brand-border)] rounded-2xl p-6 md:p-8 mb-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-[var(--brand-flame)] to-[var(--brand-amber)] flex items-center justify-center text-white font-heading text-3xl shadow-[0_0_20px_rgba(232,88,10,0.3)] border border-[var(--brand-border)]">
                                {userDetails?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="font-heading text-[var(--brand-cream)] text-2xl">{userDetails?.displayName}</h1>
                                <p className="text-[var(--brand-cream)]/50 text-sm font-mono mt-1 inline-flex items-center gap-2">
                                    <Mail size={13} className="text-[var(--brand-flame)]" /> {userDetails?.email}
                                </p>
                            </div>
                        </div>

                        <div className="h-px w-full bg-[var(--brand-border)] my-1" />

                        <div className="flex flex-col gap-2">
                            <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest">Phone Number</p>
                            {!isEditingPhone ? (
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[var(--brand-cream)]/70 text-sm font-mono inline-flex items-center gap-2">
                                        <Phone size={14} className="text-[var(--brand-flame)]" />
                                        {userDetails?.phoneNumber || 'No phone number added'}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-3">
                                    <div className="relative flex-1 w-full flex items-center bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl overflow-hidden focus-within:border-[var(--brand-flame)]/50 transition-colors">
                                        <div className="pl-4 text-[var(--brand-cream)]/30">
                                            <Phone size={14} />
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full bg-transparent p-3 text-sm text-[var(--brand-cream)] focus:outline-none font-mono tracking-widest placeholder-[var(--brand-cream)]/20"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                                        <Button
                                            onClick={() => setIsEditingPhone(false)}
                                            variant="secondary"
                                            className="flex-1 sm:flex-none"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handlePhoneSubmit}
                                            disabled={loading}
                                            variant="primary"
                                            className="flex-1 sm:flex-none"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-[var(--brand-charcoal)] border border-[var(--brand-border)] rounded-2xl p-6 md:p-8">
                    <AddressSection uid={userDetails?.uid || ""} />
                </section>

                <section className="grid grid-cols-2 gap-4 mt-8">
                    <Button variant="secondary" onClick={() => navigate('/orders')} className="w-full bg-[var(--brand-charcoal)] border-[var(--brand-border)]">
                        <Package size={16} /> My Orders
                    </Button>
                    <Button variant="secondary" onClick={() => setShowLogoutModal(true)} className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
                        <LogOut size={16} /> Log Out
                    </Button>
                </section>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={showLogoutModal}
                title="Confirm Logout"
                message="Are you sure you want to log out? You'll need to sign in again to access your account."
                confirmLabel="Yes, Log Out"
                cancelLabel="Cancel"
                onConfirm={handleLogoutClick}
                onCancel={() => setShowLogoutModal(false)}
            />
        </div>
    )
}

export default Profile