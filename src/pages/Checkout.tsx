import { useEffect, useState } from 'react'
import { updateVoucherAfterOrder, validateVoucher } from '@/services/voucherService'

// Extend the Window interface to include Razorpay
declare global {
    interface Window {
        Razorpay: any;
    }
}
import Button, { IconButton } from '../components/Button'
import { useCartStore } from '../store/cartStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { handleCheckout } from '../services/orderService'
import { updateUserPhoneNumber } from '../services/authService'
import toast from 'react-hot-toast'
import { ShoppingBag, PenBoxIcon, BadgePercent } from 'lucide-react'
import { motion } from 'framer-motion'
import AddressSection from '../components/AddressSection'

import CartSection from '../components/CartSection'
import { OrderDetails } from '../types/orderTypes'
import VoucherModal from './VoucherModal';
import { useDisclosure } from '@heroui/react';
import { Voucher } from '@/types/voucherTypes';
import VoucherAppliedModal from './VoucherAppliedModal';

const DELIVERY_PRICE = 0
const TAX_RATE = 0


const Checkout = () => {
    const { items, grossTotalPrice, totalPrice, voucherDiscount, calculateGrossTotalPrice, calculateTotalPrice, updateQuantity: updateItemQuantity, clearCart, setVoucherDiscount } = useCartStore()
    const navigate = useNavigate()
    const userDetails = useAuthStore((state) => state.userDetails)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isVoucherAppliedModalOpen, onOpenChange: onOpenVoucherAppliedModalChange, onOpen: onOpenVoucherAppliedModal } = useDisclosure();

    const [note, setNote] = useState('');
    const [preferredDeliveryTime, setPreferredDeliveryTime] = useState('');
    const [preferredDeliveryPeriod, setPreferredDeliveryPeriod] = useState('AM');
    const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  

    // console.log(appliedVoucher);
    // console.log('grossTotalPrice', grossTotalPrice);
    console.log('voucherDiscount', voucherDiscount);


    useEffect(() => {
        calculateGrossTotalPrice();

        // If a voucher is applied, revalidate it on cart change
        if (appliedVoucher) {
            // Use the same logic as when applying the voucher
            const error = validateVoucher(
                appliedVoucher,
                userDetails?.phoneNumber || '',
                grossTotalPrice + DELIVERY_PRICE // minOrderValue is checked on gross+delivery
            );
            if (error) {
                setAppliedVoucher(null);
                setVoucherDiscount(0);
                toast.error('Voucher removed: ' + error);
            } else {
                // Re-apply discount if still valid
                let discount = 0;
                if (appliedVoucher.discountType === 'percentage') {
                    discount = (grossTotalPrice * appliedVoucher.discountValue) / 100;
                } else {
                    discount = appliedVoucher.discountValue;
                }
                setVoucherDiscount(discount);
            }
        } else {
            setVoucherDiscount(0);
        }

        calculateTotalPrice(DELIVERY_PRICE, TAX_RATE);
    }, [items, grossTotalPrice, appliedVoucher, userDetails?.phoneNumber, calculateGrossTotalPrice, calculateTotalPrice]);



    useEffect(() => window.scrollTo(0, 0), [])


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

        if (!currentUser.phoneNumber || currentUser.phoneNumber.length !== 13) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        if (!preferredDeliveryTime || !preferredDeliveryPeriod) {
            toast.error('Please select your preferred delivery time');
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
            note: note,
            deliveryTime: preferredDeliveryTime + ' ' + preferredDeliveryPeriod,
            customer: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.name || '',
                email: currentUser.email || '',
                phoneNumber: currentUser.phoneNumber || '',
            },
            address: currentUser.address || '',
            voucherDiscount: voucherDiscount || null,
            voucherCode: appliedVoucher ? appliedVoucher.code : null,
        };

        const amountInPaise = Math.round(totalPrice * 100);

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
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
                    toast('Payment Cancelled');
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
                // Update voucher usage if voucher was applied
                if (success && appliedVoucher && userDetails?.phoneNumber) {
                    await updateVoucherAfterOrder(appliedVoucher, userDetails.phoneNumber);
                }
                if (success) {
                    clearCart();
                    toast.success('Payment & Order placed successfully');
                    navigate('/orders');
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
            <div className='max-w-2xl mx-auto px-4 py-8'>
                <div className='flex justify-between items-center  mb-5'>
                    <h1 className='text-3xl font-semibold lancelot text-gray-800'>Checkout</h1>

                    <Button variant='success' size='sm' onClick={() => navigate('/shop')}>
                        <ShoppingBag size={20} />
                        <p>Add More Item</p>
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
                        <h2 className=' md:text-xl font-semibold mb-6'>Delivery Information</h2>

                        <AddressSection uid={userDetails?.uid || ""} />

                        <div className='pt-6'>
                            <h3 className='text-sm text-orange-500 font-medium'>Preferred Delivery Time</h3>
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

                    {
                        appliedVoucher ? (

                            <div className='bg-white border border-dashed hover:border-green-500 rounded-xl shadow-sm p-6'>
                                <div className='flex gap-5 justify-between items-center'>
                                    <div>
                                        <p className='font-bold  capitalize'>'{appliedVoucher.code}'</p>
                                        <p className='text-xs'>Discount applied on the bill</p>
                                    </div>
                                    <button onClick={() => setAppliedVoucher(null)} className='text-sm hover:text-red-500 font-bold'>REMOVE</button>
                                </div>
                            </div>
                        ) :
                            (
                                <button className='bg-white border-2 hover:border-green-500 cursor-pointer border-dashed rounded-xl  p-4' onClick={onOpen} >
                                    <div className='flex gap-5 items-center'>
                                        <BadgePercent strokeWidth={1} color='gray' />
                                        <p>Apply Voucher </p>
                                    </div>
                                </button>
                            )
                    }


                    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                        <div className='p-6'>
                            <h2 className='text-xl font-semibold mb-6 flex items-center gap-2'>
                                <span>Bill Summary</span>
                                <div className="px-2 py-1 bg-green-100 rounded-full text-xs text-green-700 font-medium">
                                    {items.reduce((total, item) => total + item.quantity, 0)} items
                                </div>
                            </h2>

                            <div className=' mb-6'>

                                {items.map((item, index) => (
                                    <div key={index} className='flex justify-between items-center text-gray-600 py-2 text-sm'>
                                        <span className="text-gray-800">{item.productName}{item.quantity > 1 ? ` x ${item.quantity}` : ''}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-800 font-medium">₹{item.offerPrice * item.quantity}</span>
                                        </div>
                                    </div>
                                ))}

                                {
                                    appliedVoucher && (
                                        <div className='flex justify-between items-center border-t border-b border-dashed text-green-600 py-2 text-sm'>
                                            <div className="flex items-center gap-2">
                                                <span className="">Voucher Discount</span>
                                            </div>
                                            <span className=" font-medium">-₹{voucherDiscount.toFixed(2)}</span>
                                        </div>
                                    )
                                }


                                <div className='flex justify-between items-center text-gray-600 py-2 text-sm'>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">Delivery Charge</span>

                                    </div>
                                    <span className="text-gray-800 font-medium">₹{DELIVERY_PRICE.toFixed(2)}</span>
                                </div>




                                {/* <div className='flex justify-between items-center text-gray-600 py-2 text-sm'>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800">GST</span>
                                        <div className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                                            {(TAX_RATE * 100).toFixed()}%
                                        </div>
                                    </div>
                                    <span className="text-gray-800 font-medium">₹{(grossTotalPrice * TAX_RATE).toFixed(2)}</span>
                                </div> */}

                            </div>



                            <div className='pt-4 border-t border-gray-500'>
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
                                    Secure payment via Razorpay
                                </p>
                            </div>
                        </div>
                    </div>

                    {
                        appliedVoucher && (
                            <div className="bg-green-50 px-4 py-2 border border-green-400 rounded-lg mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <BadgePercent strokeWidth={1} color='green' />
                                        </div>
                                        <p className="text-green-800 font-medium">Total Savings</p>
                                    </div>
                                    <span className="text-green-700 font-bold">₹{voucherDiscount}</span>
                                </div>
                            </div>
                        )
                    }

                </div>

                <VoucherModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onOpen={onOpen}
                    onValidVoucher={(voucher) => {
                        setAppliedVoucher(voucher)
                    }}
                    onOpenVoucherAppliedModal={onOpenVoucherAppliedModal} />
                <VoucherAppliedModal
                    isOpen={isVoucherAppliedModalOpen}
                    onOpenChange={onOpenVoucherAppliedModalChange}
                    voucherCode={appliedVoucher?.code || ''}
                    discount={voucherDiscount}
                />
            </div>
        </div>
    )
}

export default Checkout
