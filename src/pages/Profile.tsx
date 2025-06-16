import React, { useEffect } from 'react'
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { handleLogout, updateUserAddress, updateUserPhone } from '../services/authService';
import { Mail, Phone } from 'lucide-react';
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
        <div className='min-h-screen bg-gray-100'>
            <div className=' md:w-2/3 w-full md:pt-10 pt-5 mx-auto'>
            
                <section className='md:p-9 p-7 m-2 bg-white rounded-2xl'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-xl text-center md:text-start md:text-2xl font-bold'>{userDetails?.displayName}</h1>
                        <p className='text-sm  text-gray-500 inline-flex items-center gap-3 mt-2'>
                            <Mail size={16} /> {userDetails?.email}
                        </p>
                        <div className='flex items-center gap-3'>
                            {!isEditingPhone ? (
                                <div className='flex items-center justify-between w-full'>
                                    <p className='text-sm  text-gray-500 inline-flex items-center gap-3'><Phone size={16} />
                                        {userDetails?.phoneNumber || 'No phone number added'}
                                    </p>
                                    {/* <p className='text-orange-500 hover:underline hover:cursor-pointer text-sm ' onClick={() => setIsEditingPhone(true)}>
                                        {userDetails?.phoneNumber ? 'Edit Phone Number' : 'Add A Phone Number'}
                                    </p> */}
                                </div>
                            ) : (
                                <div className='flex items-center w-full justify-between '>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className='border border-gray-300 rounded-xl p-2'
                                        placeholder='Enter phone number'
                                    />
                                    <div className='flex gap-3'>
                                        <Button
                                            onClick={handlePhoneSubmit}
                                            disabled={loading}
                                            variant='success'
                                        >
                                            Save
                                        </Button>
                                        <Button onClick={() => setIsEditingPhone(false)}
                                            variant='secondary'>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='mt-8 md:mt-7'>
                        <AddressSection uid={userDetails?.uid || ""} />
                    </div>
                </section>

                <section className='flex justify-center gap-3 mt-10'>
                    <Button variant='primary' onClick={() => navigate('/orders')}>Go To Orders</Button>
                    <Button variant='danger' onClick={() => setShowLogoutModal(true)}>Log Out</Button>
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