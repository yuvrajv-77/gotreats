import { useEffect, useState } from 'react'
import Button, { IconButton } from '../components/Button'
import { useCartStore } from '../store/cartStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { handleCheckout } from '../services/orderService'
import { updateUserAddress, updateUserPhoneNumber } from '../services/authService'
import toast from 'react-hot-toast'
import { Trash, ShoppingBag, Send, Check, Loader2, Pencil, X, NotebookTabs, PenBoxIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import AddressSection from '../components/AddressSection'
import Modal from '../components/Modal'
import CartSection from '../components/CartSection'
import { OrderDetails } from '../types/orderTypes'

const DELIVERY_PRICE = 20
const TAX_RATE = 0.18


const Checkout = () => {
    const { items, grossTotalPrice, totalPrice, calculateGrossTotalPrice, calculateTotalPrice, updateQuantity: updateItemQuantity, clearCart } = useCartStore()
    const navigate = useNavigate()
    const userDetails = useAuthStore((state) => state.userDetails)

    const [loading, setLoading] = useState(false)
    const [note, setNote] = useState('');
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [tempPhoneNumber, setTempPhoneNumber] = useState('');
    const [isPhoneSaving, setIsPhoneSaving] = useState(false);
    const [preferredDeliveryTime, setPreferredDeliveryTime] = useState('');
    const [preferredDeliveryPeriod, setPreferredDeliveryPeriod] = useState('AM');

    useEffect(() => {
        calculateGrossTotalPrice();
        calculateTotalPrice(DELIVERY_PRICE, TAX_RATE);
    }, [items, calculateGrossTotalPrice, calculateTotalPrice]);



    useEffect(() => {
        if (userDetails?.phoneNumber) {
            setTempPhoneNumber(userDetails.phoneNumber);
        } else {
            setTempPhoneNumber('');
        }
    }, [userDetails?.phoneNumber]);



    // const getFormattedAddress = () => {
    //     return `${addressDetails.flatNumber}, ${addressDetails.buildingName}, ${addressDetails.streetAddress}, ${addressDetails.landmark ? addressDetails.landmark + ', ' : ''}${addressDetails.area}, Mumbai - ${addressDetails.pincode}`.trim();
    // };

    useEffect(() => window.scrollTo(0, 0), [])


    const handlePhoneSubmit = async () => {
        try {
            if (!tempPhoneNumber || tempPhoneNumber.trim() === '') {
                toast.error('Please enter a phone number to continue');
                return;
            }

            if (tempPhoneNumber.length !== 10) {
                toast.error('Please enter a valid 10-digit phone number');
                return;
            }

            setIsPhoneSaving(true);
            if (userDetails?.uid) {
                await updateUserPhoneNumber(userDetails.uid, tempPhoneNumber);
                useAuthStore.getState().setUserDetails({
                    ...userDetails,
                    phoneNumber: tempPhoneNumber
                });
                setIsEditingPhone(false);
                toast.success('Phone number updated successfully');
            }
        } catch (err) {
            console.error("Failed to update phone number:", err);
            toast.error('Failed to update phone number. Please try again.');
        }
        setIsPhoneSaving(false);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-script')) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePaymentClick = async () => {
        const { userDetails: currentUser } = useAuthStore.getState();

        if (!currentUser) {
            toast.error('Please log in to continue');
            return;
        }

        if (!currentUser.address) {
            toast.error('Please add your delivery address');
            return;
        }

        if (!currentUser.phoneNumber || currentUser.phoneNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        if (!preferredDeliveryTime || !preferredDeliveryPeriod) {
            toast.error('Please select your preferred delivery time and period');
            return;
        }
        if (items.length === 0) {
            toast.error('Your cart is empty. Please add items to proceed.');
            return;
        }

        const res = await loadRazorpayScript();
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const orderDetails: OrderDetails = {
            items: items,
            grossTotalPrice: grossTotalPrice.toFixed(2),
            totalAmount: totalPrice,
            gst: grossTotalPrice * parseFloat(TAX_RATE.toFixed(2)),
            deliveryCharge: DELIVERY_PRICE,
            totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
            note: note ,
            deliveryTime: preferredDeliveryTime + ' ' + preferredDeliveryPeriod,
            customer: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.name || '',
                email: currentUser.email || '',
                phoneNumber: currentUser.phoneNumber || '',
            },
            address: currentUser.address || '',
        };

        const amountInPaise = Math.round(totalPrice * 100);

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_BWj7LzYoG7sF6V',
            amount: amountInPaise,
            currency: 'INR',
            name: 'GoTreats Tiffins',
            description: 'Order Payment',
            image: '/favicon.png',
            prefill: {
                name: currentUser?.displayName || '',
                email: currentUser?.email || '',
                contact: currentUser?.phoneNumber || ''
            },
            notes: {
                customer_Name: currentUser?.displayName || '',
                customer_Email: currentUser?.email || '',
                customer_Phone: currentUser?.phoneNumber || '',
                customer_Address: currentUser?.address || '',
                customer_Note: note || '',
                delivery_Time: preferredDeliveryTime + ' ' + preferredDeliveryPeriod,
            },
            remember_customer: true,
            theme: {
                color: '#22c55e',
            },
            modal: {
                ondismiss: function () {
                    toast('Payment popup closed');
                }
            },
            handler: async function (response: any) {
               
                const paymentDetails = {
                    ...orderDetails,
                    razorpay_payment_id: response.razorpay_payment_id,
                    paymentStatus: 'success' as 'success',
                    orderStatus: 'received' as 'received',
                };

                const success = await handleCheckout(paymentDetails);
                if (success) {
                    clearCart();
                    toast.success('Payment & Order placed successfully');
                    navigate('/Orders');
                } else {
                    toast.error('Order placement failed after payment. Please contact support.');
                }
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (items.length === 0) {
        return (
            <div className='flex md:bg-gray-100 items-center justify-center h-[80vh]'>
                <div className='flex flex-col gap-5'>
                    <img src="/shopping.png" className='w-2/3 mx-auto' alt="Empty cart" />
                    <p className='text-2xl font-semibold text-center'>Your cart is empty.</p>
                    <Button onClick={() => navigate('/shop')} variant='primary'>Go to Shop</Button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='max-w-3xl mx-auto px-4 py-8'>
                <div className='flex justify-between items-center  mb-5'>
                    <h1 className='text-3xl font-semibold lancelot text-gray-800'>Checkout</h1>
                    <Button variant='success' size='sm' onClick={() => navigate('/shop')}>
                        <ShoppingBag size={20} />
                        Add More Item
                    </Button>
                </div>

                <div className='flex flex-col gap-3'>

                    {/* ----cart--- */}
                    <CartSection
                        items={items}
                        updateItemQuantity={updateItemQuantity}
                    />

                    {/* -- note -- */}
                    <div className='bg-white rounded-xl shadow-sm p-6 space-y-3'>
                        <p className='text-sm text-orange-500 flex items-center justify-center gap-2'><PenBoxIcon size={18} /> Add any special instructions or note here</p>
                        <textarea
                            rows={1}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Add any special instructions or note here"

                        />
                    </div>

                    <div className='bg-white rounded-xl shadow-sm p-6'>
                        <h2 className='text-xl font-semibold mb-6'>Delivery Information</h2>

                        <div className='mb-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className=' text-orange-500 font-medium'>Phone Number</h3>
                                {userDetails?.phoneNumber && !isEditingPhone && (
                                    <button
                                        onClick={() => setIsEditingPhone(true)}
                                        className="px-4 py-2 text-sm text-orange-500 hover:text-orange-600 transition-colors font-medium"
                                    >
                                        Edit Number
                                    </button>
                                )}
                            </div>

                            <div className='w-full'>
                                {!userDetails ? (
                                    <div className="space-y-4">
                                        <p className="text-gray-600">Please complete your profile to add phone number.</p>
                                        <Button variant='primary' onClick={() => navigate('/profile')}>Complete Profile</Button>
                                    </div>
                                ) : !userDetails.phoneNumber && !isEditingPhone ? (
                                    <div className="space-y-4">
                                        <p className="text-gray-600">No phone number found. Please add your number.</p>
                                        <Button variant='primary' onClick={() => setIsEditingPhone(true)}>Add Phone Number</Button>
                                    </div>
                                ) : (
                                    <div className='w-full'>
                                        {isEditingPhone ? (
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        value={tempPhoneNumber}
                                                        onChange={(e) => {
                                                            const number = e.target.value.replace(/\D/g, '');
                                                            if (number.length <= 10) {
                                                                setTempPhoneNumber(number);
                                                            }
                                                        }}
                                                        className="w-full p-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Enter your 10-digit mobile number"
                                                        maxLength={10}
                                                        required
                                                    />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 border-r pr-2">+91</span>
                                                </div>
                                                {tempPhoneNumber && tempPhoneNumber.length !== 10 && (
                                                    <p className="mt-1 text-sm text-red-500">Please enter a valid 10-digit phone number</p>
                                                )}

                                                <div className='flex justify-end gap-3 mt-4'>
                                                    <Button
                                                        onClick={() => {
                                                            setIsEditingPhone(false);
                                                            setTempPhoneNumber(userDetails?.phoneNumber || '');
                                                        }}
                                                        variant='secondary'>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handlePhoneSubmit}
                                                        disabled={!tempPhoneNumber || tempPhoneNumber.length !== 10}

                                                        variant="success"
                                                    >
                                                        {loading ? "Saving..." : "Save Phone Number"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 p-4 rounded-xl flex items-center">
                                                <span className="text-gray-500 border-r pr-2 mr-3">+91</span>
                                                <p className="text-gray-800">{userDetails.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <AddressSection uid={userDetails?.uid || ""} />

                        <div className='pt-6'>
                        <h3 className=' text-orange-500 font-medium'>Preferred Delivery Time</h3>
                            <div className='flex gap-2 items-center'>
                                <input
                                    type='time'
                                    value={preferredDeliveryTime}
                                    onChange={e => setPreferredDeliveryTime(e.target.value)}
                                    className='w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                    required
                                    placeholder='Enter preferred delivery time'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                        <div className='p-6'>
                            <h2 className='text-xl font-semibold mb-6 flex items-center gap-2'>
                                <span>Bill Summary</span>
                                <div className="px-2 py-1 bg-green-100 rounded-full text-xs text-green-700 font-medium">
                                    {items.reduce((total, item) => total + item.quantity, 0)} items
                                </div>
                            </h2>

                            <div className=' mb-6'>
                                <div className='flex justify-between items-center text-gray-600 py-2'>
                                    <span className="text-gray-800">Gross Total</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800 font-medium">₹{grossTotalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className='flex justify-between items-center text-gray-600 py-2'>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">GST</span>
                                        <div className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                                            {(TAX_RATE * 100).toFixed()}%
                                        </div>
                                    </div>
                                    <span className="text-gray-800 font-medium">₹{(grossTotalPrice * TAX_RATE).toFixed(2)}</span>
                                </div>

                                <div className='flex justify-between items-center text-gray-600 py-2'>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">Delivery Fee</span>
                                        <div className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                                            Fixed
                                        </div>
                                    </div>
                                    <span className="text-gray-800 font-medium">₹{DELIVERY_PRICE.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-green-800 font-medium">Total Savings</p>
                                            <p className="text-sm text-green-600">Applied to your order</p>
                                        </div>
                                    </div>
                                    <span className="text-green-700 font-bold">₹{(grossTotalPrice * 0.1).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className='pt-4 border-t border-dashed'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Total Amount</h3>
                                        <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handlePaymentClick}
                                className='w-full mt-6 bg-gradient-to-r text-lg from-green-400 to-green-600 text-white py-4 rounded-2xl hover:from-orange-400 hover:to-orange-400 transition-colors duration-300 flex items-center justify-center gap-2 font-medium shadow-xl shadow-green-100'
                            >
                                <span>Proceed to Payment</span>
                                <span className="text-2xl">•</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </motion.button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <p className="text-xs">
                                    Secure payment gateway • Terms & conditions apply
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Checkout