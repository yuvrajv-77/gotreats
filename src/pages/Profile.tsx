import React from 'react'
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Button from '../components/Button';
import { Briefcase, House, MapPinPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const userDetails = useAuthStore((state) => state.userDetails)
    const items = useCartStore((state) => state.items);
    const addresses = [
        {
            id: 1,
            name: 'Home',
            address: 'B-433 Aruna Towers, Apt 4B, Ganesh Nagar, Shivaji Nagar, Nagpur, Maharashtra, India',
        },
        // {
        //     id: 2,
        //     name: 'Office',
        //     address: '456 Office Street, New York, NY 10002,United States',
        // },

    ];;

    return (
        <div className='md:bg-gray-100 h-screen '>
            <div className='md:w-2/3 space-y-10 p-4 mx-auto '>

                <div className=' md:p-6  bg-white items-center w-full flex justify-between'>
                    <div>
                        <h1 className='text-xl md:text-4xl font-bold'>{userDetails?.displayName}</h1>
                        <p className='text-sm md:text-lg text-gray-500'>{userDetails?.email}</p>
                    </div>
                    <Button className=''>Edit Profile</Button>
                </div>

                {/* Addresses */}
                <div className=' md:p-6  bg-white w-full'>
                    <div className='flex mb-2 items-center justify-between'>
                        <h3 className='text-xl mb-2 font-bold'> Address</h3>
                        <Button className=''>Edit Address</Button>

                    </div>
                    {/* <p className='text-gray-500 mb-4 text-sm'>Please select a saved delivery address</p> */}


                    <div className="flex md:flex-row flex-col gap-2 flex-wrap ">

                        {addresses.map((address) => (
                            <div className="flex items-start" key={address.id}>
                                {/* <input
                                    type="radio"
                                    name="hs-radio-group"
                                    className="shrink-0 mt-6 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                    id={`hs-radio-group-${address.id}`}
                                    defaultChecked={index === 0} // Select the first address by default
                                /> */}
                                <label htmlFor={`hs-radio-group-${address.id}`}>
                                    <div className="ms-2 w-full md:w-64 p-4 space-y-2 border border-gray-200 rounded-md hover:border-gray-300 hover:cursor-pointer">
                                        <h3 className="gap-2 text-sm md:text-base font-medium text-gray-900 flex items-center">
                                            {address.name === 'Home' ? <House size={20} /> : <Briefcase size={20} />}   {address.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{address.address}</p>
                                    </div>
                                </label>
                            </div>
                        ))}

                        {/* <button className="w-full py-3  md:w-54 flex gap-2 items-center justify-center  hover:bg-gray-100 focus:bg-gray-100  border border-gray-200 rounded-md">
                                <MapPinPlus size={20} />Add Address
                            </button> */}


                    </div>
                </div>
                <div className='mt-4 flex items-center gap-2 flex-col'>
                    <Button onClick={() => navigate('/orders')}>Go To Orders</Button>
                </div>
            </div>
        </div>
    )
}

export default Profile