
import React, { useEffect } from 'react'
import Button, { IconButton } from '../components/Button';
import { Cart } from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { initializeRazorpayPayment } from '../services/razorpay';
import { handleCheckout } from '../services/orderService';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';

const DELIVERY_PRICE = 40;
const TAX_RATE = 0.18;

const Checkout = () => {
    const { items, grossTotalPrice, totalPrice, calculateGrossTotalPrice, calculateTotalPrice } = useCartStore()
    const user = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const userDetails = useAuthStore((state) => state.userDetails)
    const [address, setAddress] = React.useState(userDetails?.address || '');
    const [isEditing, setIsEditing] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        calculateGrossTotalPrice();
        calculateTotalPrice(DELIVERY_PRICE, TAX_RATE);
    }, [items, calculateGrossTotalPrice, calculateTotalPrice]);

    


    const handlePaymentClick = async () => {
        const {user, userDetails } = useAuthStore.getState();


        if (!user || !userDetails.address || !userDetails.phoneNumber) {
            toast.error('Cannot Process Payment Without Address and Phone Number');
            return;
        }

        const orderDetails = {
            items: items,
            totalAmount: totalPrice,
            deliveryAddress: userDetails?.address,
            customer:userDetails

        };

        const success = await handleCheckout(orderDetails);

        if (success) {
            useCartStore.getState().clearCart();
            toast.success('Order placed successfully');
            navigate('/');
        }
    };



    // In your handlePaymentClick function:
    // const handlePaymentClick = async () => {
    //     if (!user) {
    //         alert('Please login to place order');
    //         navigate('/login');
    //         return;
    //     }

    //     try {
    //         const options = await initializeRazorpayPayment(
    //             user,
    //             userDetails,
    //             totalPrice,
    //             items,
    //             userDetails?.address
    //         );

    //         const rzp = new window.Razorpay(options);
    //         rzp.open();

    //         // Success handler
    //         options.handler = async (response) => {
    //             const orderId = await options.handler(response);
    //             useCartStore.getState().clearCart();
    //             alert('Payment successful!');
    //             navigate('/orders');
    //         };
    //     } catch (error) {
    //         console.error('Payment failed:', error);
    //         alert('Payment initialization failed');
    //     }
    // };



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
                        <h3 className='text-xl mb-2 font-bold'>Deliver To</h3>


                        {/* Addresses */}
                        <div className="flex md:flex-row flex-col gap-2 flex-wrap ">

                            <div className="flex items-start w-full" >

                                
                                <div className='w-full'>
                                    {!userDetails?.address && !userDetails?.phoneNumber ? (
                                        <div className="space-y-4">
                                            <p className="text-gray-600">No address found. Please Complete Your Profile.</p>
                                            <p className="text-gray-600">No Phone Number found.</p>
                                            <Button onClick={() => navigate('/profile')}>Complete Profile</Button>
                                        </div>
                                    ) : (
                                        <div className='flex items-center w-full justify-evenly'>

                                            <textarea
                                                value={userDetails?.address}
                                                disabled
                                                className={`border border-gray-300 rounded-xl p-2 w-1/2 bg-white'
                                                }`}
                                                placeholder='Enter your Full Address'
                                            />
                                            <p className='text-sm text-orange-500'>Change</p>
                                        </div>

                                    )}

                                </div>
                            </div>

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