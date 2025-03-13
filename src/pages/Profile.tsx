import React from 'react'
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { handleLogout, updateUserAddress, updateUserPhone } from '../services/authService';
import { Mail, Phone } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate()
    const userDetails = useAuthStore((state) => state.userDetails)
    const [address, setAddress] = React.useState(userDetails?.address || '');
    const [phoneNumber, setPhoneNumber] = React.useState(userDetails?.phoneNumber || '');
    const [isEditingAddress, setIsEditingAddress] = React.useState(false);
    const [isEditingPhone, setIsEditingPhone] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleAddressSubmit = async () => {
        try {
            setLoading(true);
            if (userDetails?.uid) {
                await updateUserAddress(userDetails.uid, address);
                setIsEditingAddress(false);
            }
        } catch (error) {
            console.error("Failed to update address:", error);
        }
        setLoading(false);
    }

    const handlePhoneSubmit = async () => {
        try {
            setLoading(true);
            if (userDetails?.uid) {
                await updateUserPhone(userDetails.uid, phoneNumber);
                setIsEditingPhone(false);
            }
        } catch (error) {
            console.error("Failed to update phone:", error);
        }
        setLoading(false);
    }

    return (
        <div className='md:bg-gray-100 h-screen'>
            <div className='md:w-2/3 space-y-10 p-4 mx-auto'>
                <div className='md:p-6 bg-white items-center w-full flex justify-between'>
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-xl md:text-4xl font-bold'>{userDetails?.displayName}</h1>
                        <p className='text-sm md:text-lg text-gray-500 inline-flex items-center gap-3 mt-6'>
                            <Mail size={20} /> {userDetails?.email}
                        </p>
                        <div className='flex items-center gap-3'>
                            
                            {!isEditingPhone ? (
                                <div className='flex items-center gap-2'>
                                    <p className='text-sm md:text-lg text-gray-500 inline-flex items-center gap-3'><Phone size={20} />
                                        {userDetails?.phoneNumber || 'No phone number added'}
                                    </p>
                                    <p className='text-orange-500 hover:underline hover:cursor-pointer ' onClick={() => setIsEditingPhone(true)}>
                                        {userDetails?.phoneNumber ? 'Edit' : 'Add Phone'}
                                    </p>
                                </div>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className='border border-gray-300 rounded-xl p-2'
                                        placeholder='Enter phone number'
                                    />
                                    <Button 
                                        onClick={handlePhoneSubmit}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={() => setIsEditingPhone(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button className='' onClick={() => handleLogout()}>Log Out</Button>
                </div>

                {/* Addresses */}
                <div className=' md:p-6  bg-white w-full'>
                    <div className='flex mb-2 items-center justify-between'>
                        <h3 className='text-xl mb-2 font-bold'> Thikana</h3>
                        {userDetails?.address && (
                            <Button onClick={() => setIsEditingAddress(!isEditingAddress)}>
                                {isEditingAddress ? 'Save Address' : 'Edit Address'}
                            </Button>
                        )}
                    </div>
                    <div>
                        {!userDetails?.address && !isEditingAddress ? (
                            <div className="space-y-4">
                                <p className="text-gray-600">No address found. Please add your address.</p>
                                <Button onClick={() => setIsEditingAddress(true)}>Add Address</Button>
                            </div>
                        ) : (
                            <textarea
                                value={address}
                                disabled={!isEditingAddress}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`border border-gray-300 rounded-xl p-2 w-full ${!isEditingAddress ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                placeholder='Enter your Full Address'
                            />
                        )}
                        {isEditingAddress && (
                            <Button
                                className="mt-4"
                                disabled={loading}
                                onClick={handleAddressSubmit}
                            >
                                Save Address
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className='mt-4 flex items-center gap-2 flex-col'>
                <Button onClick={() => navigate('/orders')}>Go To Orders</Button>
            </div>
        </div>
    )
}

export default Profile