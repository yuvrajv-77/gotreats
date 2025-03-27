import { useEffect, useState } from 'react'
import Button, { IconButton } from '../components/Button';
import { Cart } from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { handleCheckout } from '../services/orderService';
import { updateUserAddress } from '../services/authService';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const DELIVERY_PRICE = 40;
const TAX_RATE = 0.18;

const Checkout = () => {
    const { items, grossTotalPrice, totalPrice, calculateGrossTotalPrice, calculateTotalPrice, clearCart } = useCartStore();
    const navigate = useNavigate();
    const userDetails = useAuthStore((state) => state.userDetails);
    const auth = getAuth();
    const user = auth.currentUser;
    
    // State management
    const [address, setAddress] = useState(userDetails?.address || '');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [cashfree, setCashfree] = useState(null);
    
    // Payment related states
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSessionId, setPaymentSessionId] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentRedirect, setPaymentRedirect] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [orderId, setOrderId] = useState('');

    // Calculate totals when items change
    useEffect(() => {
        calculateGrossTotalPrice();
        calculateTotalPrice(DELIVERY_PRICE, TAX_RATE);
    }, [items, calculateGrossTotalPrice, calculateTotalPrice]);

    // Update address when user details change
    useEffect(() => {
        if (userDetails?.address) {
            setAddress(userDetails.address);
        }
    }, [userDetails]);

    // Initialize Cashfree SDK
    useEffect(() => {
        const initializeSDK = async () => {
            try {
                const cf = await load({ mode: 'sandbox' }); // Change to 'production' for live environment
                setCashfree(cf);
            } catch (error) {
                console.error('Error loading Cashfree SDK:', error);
                toast.error('Payment system initialization failed');
            }
        };
        initializeSDK();
    }, []);

    // Handle address update
    const handleAddressSubmit = async () => {
        if (!address.trim()) {
            toast.error('Please enter a valid address');
            return;
        }
        
        try {
            setLoading(true);
            if (userDetails?.uid) {
                await updateUserAddress(userDetails.uid, address);
                setIsEditingAddress(false);
                toast.success('Address updated successfully');
            }
        } catch (error) {
            console.error('Failed to update address:', error);
            toast.error('Failed to update address');
        } finally {
            setLoading(false);
        }
    };

    // Handle payment process
    const handlePayment = async () => {
        if (!address.trim()) {
            toast.error('Please add a delivery address');
            return;
        }
        
        try {
            setPaymentLoading(true);
            const functions = getFunctions();
            console.log('Setting up Firebase functions');
            if (process.env.NODE_ENV === 'development') {
                console.log('Connecting to Firebase emulator');
                connectFunctionsEmulator(functions, '127.0.0.1', 5001);
            }
            
            const createOrderFunction = httpsCallable(functions, 'createCashfreeOrder');
            console.log('Calling createCashfreeOrder function');
            const result = await createOrderFunction({
                amount: totalPrice,
                customerDetails: {
                    customer_id: userDetails?.uid || "guest_user",
                    customer_phone: userDetails?.phone || "",
                    customer_name: userDetails?.name || "Guest User",
                    customer_email: userDetails?.email || ""
                },
            });

            console.log('Order created successfully:', result.data);
            setPaymentSessionId(result.data.data.payment_session_id);
            setOrderId(result.data.orderId);
            console.log('Payment session ID:', result.data.data.payment_session_id);
            console.log('Order ID:', result.data.orderId);

            if (cashfree && result.data.data.payment_session_id) {
                console.log('Initiating Cashfree checkout');
                let checkoutOptions = {
                    paymentSessionId: result.data.data.payment_session_id,
                    redirectTarget: '_modal',
                };
                
                console.log('Checkout options:', checkoutOptions);
                cashfree.checkout(checkoutOptions).then(async (checkoutResult) => {
                    console.log('Cashfree checkout result:', checkoutResult);
                    
                    if (checkoutResult.error) {
                        console.error('Payment error:', checkoutResult.error);
                        setPaymentError(checkoutResult.error);
                        toast.error('Payment failed.');
                    }
                    if (checkoutResult.redirect) {
                        console.log('Payment redirected');
                        setPaymentRedirect(true);
                        toast.success('Payment redirected.');
                    }
                    if (checkoutResult.paymentDetails) {
                        console.log('Payment successful:', checkoutResult.paymentDetails);
                        setPaymentDetails(checkoutResult.paymentDetails);
                        toast.success('Payment successful.');
                        
                        console.log('Fetching payment details for order:', checkoutResult.paymentDetails.orderId);
                        const details = await fetchPaymentDetails(checkoutResult.paymentDetails.orderId);
                        console.log('Fetched payment details:', details);
                        
                        console.log('Navigating to orders page with payment and order details');
                        navigate('/orders', { 
                            state: { 
                                paymentDetails: checkoutResult.paymentDetails, 
                                orderDetails: { 
                                    items, 
                                    grossTotalPrice, 
                                    totalPrice, 
                                    DELIVERY_PRICE, 
                                    TAX_RATE, 
                                    note, 
                                    address 
                                } 
                            } 
                        });
                    }
                    setPaymentLoading(false);
                });
            } else {
                console.error('Cashfree SDK not loaded or payment session ID not available');
                setPaymentLoading(false);
                toast.error('Payment system not ready. Please try again.');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            toast.error('Payment processing error.');
            setPaymentLoading(false);
        }
    };

    const fetchPaymentDetails = async (orderId) => {
        console.log('Fetching payment details for order:', orderId);
        try {
            const functions = getFunctions();
            if (process.env.NODE_ENV === 'development') {
                connectFunctionsEmulator(functions, '127.0.0.1', 5001);
            }
            const fetchPaymentFunction = httpsCallable(functions, 'fetchCashfreePaymentDetails');
            console.log('Calling fetchCashfreePaymentDetails function');
            const result = await fetchPaymentFunction({ orderId });
            console.log('Payment details fetched:', result.data);
            return result.data.data;
        } catch (error) {
            console.error('Error fetching payment details:', error);
            toast.error('Failed to fetch payment details.');
            setFetchError(error);
            return null;
        }
    };

    // Empty cart view
    if (items.length === 0) {
        return (
            <div className='flex md:bg-gray-100 items-center justify-center h-[80vh]'>
                <div className='flex flex-col gap-5'>
                    <img src="/shopping.png" className='w-2/3 mx-auto' alt="Empty cart" />
                    <p className='text-2xl font-semibold text-center'>Your cart is empty.</p>
                    <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
                </div>
            </div>
        );
    }

    return (
        <div className='md:bg-gray-100 pb-20'>
            <div className='md:w-2/4 px-5 mx-auto'>
                <h1 className='text-3xl md:text-4xl font-semibold lancelot py-5 text-gray-700'>Checkout</h1>
                <div className='flex flex-col gap-5 border-green-300'>

                    {/* box 1 */}
                    <div className='md:p-6 bg-white w-full'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-xl font-bold'>Cart ({items.reduce((total, item) => total + item.quantity, 0)})</h3>
                            <IconButton onClick={() => useCartStore.getState().clearCart()}><Trash /></IconButton>
                        </div>
                        <Cart />
                    </div>
                    <hr className='md:hidden block' />
                    <div className='md:p-6 bg-white w-full'>
                        <div className='flex items-center justify-between'>
                            <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                                className={`border border-gray-300 rounded-xl p-2 w-full bg-white`} placeholder='Add Cooking Note' />
                        </div>
                    </div>
                    <hr className='md:hidden block' />

                    {/* box 2 */}
                    <div className='md:p-6 bg-white w-full'>
                        <div className='flex mb-2 items-center justify-between'>
                            <h3 className='text-xl mb-2 font-bold'>Deliver To</h3>
                            {address && (
                                <Button onClick={() => {
                                    if (isEditingAddress) {
                                        handleAddressSubmit();
                                    } else {
                                        setIsEditingAddress(!isEditingAddress);
                                    }
                                }} disabled={loading}>
                                    {isEditingAddress ? 'Save Address' : 'Edit Address'}
                                </Button>
                            )}
                        </div>

                        {/* Addresses */}
                        <div className="flex md:flex-row flex-col gap-2 flex-wrap">
                            <div className="flex items-start w-full">
                                <div className='w-full'>
                                    {!address && !userDetails?.phoneNumber ? (
                                        <div className="space-y-4">
                                            <p className="text-gray-600">No address found. Please Complete Your Profile.</p>
                                            <p className="text-gray-600">No Phone Number found.</p>
                                            <Button onClick={() => navigate('/profile')}>Complete Profile</Button>
                                        </div>
                                    ) : !address && !isEditingAddress ? (
                                        <div className="space-y-4">
                                            <p className="text-gray-600">No address found. Please add your address.</p>
                                            <Button onClick={() => setIsEditingAddress(true)}>Add Address</Button>
                                        </div>
                                    ) : (
                                        <div className='w-full'>
                                            <textarea
                                                value={address}
                                                disabled={!isEditingAddress}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className={`border border-gray-300 rounded-xl p-2 w-full ${!isEditingAddress ? 'bg-gray-50' : 'bg-white'}`}
                                                placeholder='Enter your Full Address'
                                            />
                                            {isEditingAddress && (
                                                <Button
                                                    className="mt-4 mr-2"
                                                    disabled={loading}
                                                    onClick={handleAddressSubmit}
                                                >
                                                    Save Address
                                                </Button>
                                            )}
                                            {isEditingAddress && (
                                                <Button
                                                    className="mt-4"
                                                    onClick={() => {
                                                        setIsEditingAddress(false);
                                                        setAddress(userDetails?.address || '');
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='md:hidden block' />
                    {/* box 3 */}
                    <div className='md:p-6 bg-white w-full mb-10'>
                        <h3 className='text-xl mb-4 font-bold'>Bill Details</h3>
                        <div className='px-10 md:px-20 text-gray-600 text-sm md:text-base space-y-2'>
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

                            <Button
                                onClick={handlePayment}
                                className='w-full'
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? 'Processing...' : 'Continue to Payment'}
                            </Button>
                        </div>
                        {paymentError && <p>Error: {JSON.stringify(paymentError)}</p>}
                        {paymentRedirect && <p>Payment Redirected</p>}
                        {paymentDetails && <p>Payment Details: {JSON.stringify(paymentDetails)}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Checkout