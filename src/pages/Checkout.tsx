import { Briefcase, Delete, House, MapPinPlus, Trash } from 'lucide-react'
import React, { useEffect } from 'react'
import Button, { IconButton } from '../components/Button';
import { Cart } from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { initializeRazorpayPayment } from '../services/razorpay';

const DELIVERY_PRICE = 40;
const TAX_RATE = 0.18;

const Checkout = () => {
    const { items, grossTotalPrice, totalPrice, calculateGrossTotalPrice, calculateTotalPrice } = useCartStore()
    const user = useAuthStore((state) => state.user)
    const userDetails = useAuthStore((state) => state.userDetails)
    const navigate = useNavigate()

    useEffect(() => {
        calculateGrossTotalPrice();
        calculateTotalPrice(DELIVERY_PRICE, TAX_RATE);
    }, [items, calculateGrossTotalPrice, calculateTotalPrice]);

    // const addresses = [
    //     {
    //         id: 1,
    //         name: 'Home',
    //         address: 'B-433 Aruna Towers, Apt 4B, Ganesh Nagar, Shivaji Nagar, Nagpur, Maharashtra, India',
    //     },
    //     {
    //         id: 2,
    //         name: 'Office',
    //         address: '456 Office Street, New York, NY 10002,United States',
    //     },
    //     
    // ];


    // const handlePaymentClick = async () => {
    //     const {user, userDetails } = useAuthStore.getState();


    //     if (!user) {
    //         alert('Please login to place order');
    //         navigate('/login');
    //         return;
    //     }

    //     const orderDetails = {
    //         items: items,
    //         totalAmount: totalPrice,
    //         deliveryAddress: userDetails?.address,
    //         customer:userDetails

    //     };

    //     const success = await handleCheckout(orderDetails);

    //     if (success) {
    //         useCartStore.getState().clearCart();
    //         alert('Order placed successfully!');
    //         navigate('/');
    //     }
    // };



    // In your handlePaymentClick function:
    const handlePaymentClick = async () => {
        if (!user) {
            alert('Please login to place order');
            navigate('/login');
            return;
        }

        try {
            const options = await initializeRazorpayPayment(
                user,
                userDetails,
                totalPrice,
                items,
                userDetails?.address
            );

            const rzp = new window.Razorpay(options);
            rzp.open();

            // Success handler
            options.handler = async (response) => {
                const orderId = await options.handler(response);
                useCartStore.getState().clearCart();
                alert('Payment successful!');
                navigate('/orders');
            };
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment initialization failed');
        }
    };



    if (items.length === 0) {
        return (
            <div className='flex md:bg-gray-100   items-center justify-center h-[80vh] '>
                <div className='flex flex-col  gap-5 '>
                    <img src="/shopping.png" className='w-2/3 mx-auto' alt="" />
                    <p className='text-2xl font-semibold text-center'>Your cart is empty.</p>
                    <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
                </div>
            </div>
        );
    }
    return (
        <div className='md:bg-gray-100  '>
            <div className='md:w-2/4 px-5 mx-auto  '>
                <h1 className='text-3xl md:text-4xl font-semibold lancelot py-5 text-gray-700'>Checkout</h1>
                <div className=' flex flex-col  gap-5  border-green-300'>

                    {/* box 1 */}
                    <div className=' md:p-6  bg-white w-full'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-xl font-bold'>Cart ({items.reduce((total, item) => total + item.quantity, 0)})</h3>
                            <IconButton onClick={() => useCartStore.getState().clearCart()}><Trash /></IconButton>
                        </div>
                        <Cart />
                    </div>
                    <hr className='md:hidden block' />
                    {/* box 2 */}
                    <div className=' md:p-6  bg-white w-full'>
                        <h3 className='text-xl mb-2 font-bold'>Select a Delivery address</h3>
                        <p className='text-gray-500 mb-4 text-sm'>Please select a saved delivery address</p>

                        {/* Addresses */}
                        <div className="flex md:flex-row flex-col gap-2 flex-wrap ">

                            <div className="flex items-start" >
                                {/* <input
                                        type="radio"
                                        name="hs-radio-group"
                                        className="shrink-0 mt-6 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                        id={`hs-radio-group-${address.id}`}
                                        defaultChecked={index === 0} // Select the first address by default
                                    /> */}
                                <label htmlFor={`hs-radio-group`}>
                                    <div className="ms-2 w-full md:w-64 p-4 space-y-2 border border-gray-200 rounded-md hover:border-gray-300 hover:cursor-pointer">
                                        <h3 className="gap-2 text-sm md:text-base font-medium text-gray-900 flex items-center">
                                            {/* {address.name === 'Home' ? <House size={20} /> : <Briefcase size={20} />}   {address.name} */}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{userDetails?.address}</p>
                                    </div>
                                </label>
                            </div>
                            {
                                !userDetails?.address &&

                                <button className="w-full py-3  md:w-54 flex gap-2 items-center justify-center  hover:bg-gray-100 focus:bg-gray-100  border border-gray-200 rounded-md">
                                    <MapPinPlus size={20} />Add Address
                                </button>
                            }


                        </div>


                    </div>
                    <hr className='md:hidden block' />
                    {/* box 3 */}
                    <div className=' md:p-6  bg-white w-full mb-10'>
                        <h3 className='text-xl mb-4 font-bold'>Bill Details</h3>
                        <div className=' px-10 md:px-20 text-gray-600 text-sm md:text-base space-y-2' >
                            <div className='flex justify-between'>
                                <p>Total Items </p>
                                <p>{items.reduce((total, item) => total + item.quantity, 0)}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>Gross Total </p>
                                <p>₹{grossTotalPrice}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>GST </p>
                                <p>₹{(grossTotalPrice * TAX_RATE).toFixed(2)}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>Delivery Charge</p>
                                <p>₹{DELIVERY_PRICE}</p>
                            </div>
                            <hr className='my-2' />
                            <div className='flex justify-between text-2xl text-black my-5 md:font-bold'>
                                <p>To Pay</p>
                                <p>₹{totalPrice}</p>
                            </div>

                            <Button onClick={handlePaymentClick} className='w-full'>Continue to Payment</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

declare global {
    interface Window {
        Razorpay: any
    }
}

export default Checkout