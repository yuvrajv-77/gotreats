import { useEffect, useState } from 'react'
import { updateVoucherAfterOrder, validateVoucher } from '@/services/voucherService'

declare global {
    interface Window { Razorpay: any; }
}

import Button from '../components/Button'
import { useCartStore } from '../store/cartStore'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { handleCheckout } from '../services/orderService'
import toast from 'react-hot-toast'
import { ShoppingBag, PenLine, BadgePercent, ArrowLeft, Shield, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import AddressSection from '../components/AddressSection'
import CartSection from '../components/CartSection'
import { OrderDetails } from '../types/orderTypes'
import VoucherModal from './VoucherModal';
import { Radio, RadioGroup, useDisclosure } from '@heroui/react';
import { Voucher } from '@/types/voucherTypes';
import VoucherAppliedModal from './VoucherAppliedModal';
import OrderPlacedModal from './OrderPlacedModal';
import { useOrderPlacedModalStore } from '@/store/orderPlacedModalStore';

const DELIVERY_PRICE = 20;
const TAX_RATE = 0;

const Checkout = () => {
    const { items, grossTotalPrice, totalPrice, voucherDiscount, calculateGrossTotalPrice, calculateTotalPrice, updateQuantity: updateItemQuantity, clearCart, setVoucherDiscount } = useCartStore()
    const navigate = useNavigate()
    const userDetails = useAuthStore((state) => state.userDetails)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isVAOpen, onOpenChange: onVAOpenChange, onOpen: onVAOpen } = useDisclosure();
    const [paymentMode, setPaymentMode] = useState('online');
    const [note, setNote] = useState('');
    const [preferredDeliveryTime, setPreferredDeliveryTime] = useState('');
    const [preferredDeliveryPeriod, setPreferredDeliveryPeriod] = useState('AM');
    const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

    useEffect(() => {
        calculateGrossTotalPrice();
        if (appliedVoucher) {
            const error = validateVoucher(appliedVoucher, userDetails?.phoneNumber || '', grossTotalPrice + DELIVERY_PRICE);
            if (error) {
                setAppliedVoucher(null);
                setVoucherDiscount(0);
                toast.error('Voucher removed: ' + error);
            } else {
                let discount = appliedVoucher.discountType === 'percentage'
                    ? (grossTotalPrice * appliedVoucher.discountValue) / 100
                    : appliedVoucher.discountValue;
                setVoucherDiscount(discount);
            }
        } else {
            setVoucherDiscount(0);
        }
        calculateTotalPrice(DELIVERY_PRICE, TAX_RATE);
    }, [items, grossTotalPrice, appliedVoucher]);

    useEffect(() => window.scrollTo(0, 0), [])

    const loadRazorpayScript = () => new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) { resolve(true); return; }
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handlePaymentClick = async () => {
        const { userDetails: currentUser } = useAuthStore.getState();
        if (!currentUser) { toast.error('Please log in'); return; }
        if (!currentUser.address) { toast.error('Add delivery address'); return; }
        if (!currentUser.phoneNumber || currentUser.phoneNumber.length !== 13) { toast.error('Valid phone required'); return; }
        if (!preferredDeliveryTime) { toast.error('Select delivery time'); return; }
        if (items.length === 0) { toast.error('Cart is empty'); return; }

        const orderDetails: OrderDetails = {
            items, grossTotalPrice: grossTotalPrice.toFixed(2), totalAmount: totalPrice,
            gst: grossTotalPrice * parseFloat(TAX_RATE.toFixed(2)),
            deliveryCharge: DELIVERY_PRICE, totalQuantity: items.reduce((t, i) => t + i.quantity, 0),
            note, deliveryTime: preferredDeliveryTime + ' ' + preferredDeliveryPeriod,
            customer: { uid: currentUser.uid, name: currentUser.displayName || currentUser.name || '', email: currentUser.email || '', phoneNumber: currentUser.phoneNumber || '' },
            address: currentUser.address || '', voucherDiscount: voucherDiscount || null, voucherCode: appliedVoucher?.code ?? null,
        };

        if (paymentMode === 'cod') {
            const success = await handleCheckout({ ...orderDetails, paymentStatus: 'pending', orderStatus: 'received' });
            if (success && appliedVoucher && userDetails?.phoneNumber) await updateVoucherAfterOrder(appliedVoucher, userDetails.phoneNumber);
            if (success) { clearCart(); useOrderPlacedModalStore.getState().open(); navigate('/orders'); }
            else toast.error('Order failed. Contact support.');
            return;
        }

        const res = await loadRazorpayScript();
        if (!res) { toast.error('Razorpay failed to load.'); return; }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: Math.round(totalPrice * 100), currency: 'INR',
            name: 'GoTreats Tiffins', description: 'Order Payment', image: '/favicon.png',
            prefill: { name: currentUser?.displayName || '', email: currentUser?.email || '', contact: currentUser?.phoneNumber || '' },
            theme: { color: '#E8580A' },
            modal: { ondismiss: () => toast('Payment Cancelled') },
            handler: async (response: any) => {
                const success = await handleCheckout({ ...orderDetails, razorpay_payment_id: response.razorpay_payment_id, paymentStatus: 'success', orderStatus: 'received' });
                if (success && appliedVoucher && userDetails?.phoneNumber) await updateVoucherAfterOrder(appliedVoucher, userDetails.phoneNumber);
                if (success) { clearCart(); useOrderPlacedModalStore.getState().open(); navigate('/orders'); }
                else toast.error('Order failed after payment. Contact support.');
            },
        };
        new window.Razorpay(options).open();
    };

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] bg-[var(--brand-dark)]">
                <div className="text-center px-6">
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="font-heading text-2xl text-[var(--brand-cream)] mb-2">Your cart is empty</h2>
                    <p className="text-[var(--brand-cream)]/40 font-mono text-sm mb-8">Add some delicious items first</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold hover:bg-[#C94808] transition-colors mx-auto"
                    >
                        <ShoppingBag size={18} /> Go to Menu
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--brand-dark)]">
            {/* Header */}
            <div className="sticky top-16 z-20 bg-[var(--brand-dark)]/95 backdrop-blur border-b border-[var(--brand-border)] px-4 md:px-8 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 text-[var(--brand-cream)]/60 transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="font-heading text-xl text-[var(--brand-cream)]">Checkout</h1>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-1.5 text-[var(--brand-flame)] text-sm font-mono hover:underline"
                    >
                        <ShoppingBag size={14} /> Add More
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

                {/* Cart items */}
                <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-charcoal)] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[var(--brand-border)]">
                        <h2 className="font-heading text-[var(--brand-cream)] text-base">
                            Your Order
                            <span className="ml-2 font-mono text-xs text-[var(--brand-cream)]/40">
                                ({items.reduce((t, i) => t + i.quantity, 0)} items)
                            </span>
                        </h2>
                    </div>
                    <CartSection items={items} updateItemQuantity={updateItemQuantity} />
                </div>

                {/* Note */}
                <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-charcoal)] p-5">
                    <label className="flex items-center gap-2 text-[var(--brand-cream)]/60 text-xs font-mono uppercase tracking-widest mb-3">
                        <PenLine size={13} /> Special Instructions
                    </label>
                    <textarea
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl p-3 text-sm text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/25 focus:outline-none focus:border-[var(--brand-flame)]/50 font-body resize-none transition-colors"
                        placeholder="Any special instructions for your order…"
                    />
                </div>

                {/* Delivery info */}
                <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-charcoal)] p-5 space-y-5">
                    <h2 className="font-heading text-[var(--brand-cream)] text-base">Delivery Details</h2>
                    <AddressSection uid={userDetails?.uid || ""} />
                    <div>
                        <label className="text-[var(--brand-cream)]/50 text-xs font-mono uppercase tracking-widest block mb-2">Preferred Delivery Time</label>
                        <input
                            type="time"
                            value={preferredDeliveryTime}
                            onChange={e => setPreferredDeliveryTime(e.target.value)}
                            className="w-full bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl p-3 text-sm text-[var(--brand-cream)] focus:outline-none focus:border-[var(--brand-flame)]/50 font-mono transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[var(--brand-cream)]/50 text-xs font-mono uppercase tracking-widest block mb-2">Payment Mode</label>
                        <RadioGroup size='sm' value={paymentMode} onValueChange={setPaymentMode} className="gap-3">
                            <Radio value="cod" classNames={{ label: 'text-[var(--brand-cream)]/70 text-sm' }}>Cash on Delivery</Radio>
                            <Radio value="online" description='UPI, Card, NetBanking' classNames={{ label: 'text-[var(--brand-cream)]/70 text-sm' }}>Online (Razorpay)</Radio>
                        </RadioGroup>
                    </div>
                </div>

                {/* Voucher */}
                {appliedVoucher ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BadgePercent size={18} className="text-emerald-400" />
                            <div>
                                <p className="font-mono text-xs text-emerald-400 font-bold">{appliedVoucher.code}</p>
                                <p className="font-mono text-xs text-[var(--brand-cream)]/40">-₹{voucherDiscount.toFixed(2)} saved</p>
                            </div>
                        </div>
                        <button onClick={() => setAppliedVoucher(null)} className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors">REMOVE</button>
                    </div>
                ) : (
                    <button
                        onClick={onOpen}
                        className="w-full rounded-2xl border border-dashed border-[var(--brand-border)] hover:border-[var(--brand-flame)]/40 p-4 flex items-center gap-3 text-[var(--brand-cream)]/40 hover:text-[var(--brand-cream)] transition-all"
                    >
                        <BadgePercent size={18} />
                        <span className="font-mono text-sm">Apply Voucher</span>
                    </button>
                )}

                {/* Bill summary */}
                <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-charcoal)] p-5">
                    <h2 className="font-heading text-[var(--brand-cream)] text-base mb-4">Bill Summary</h2>
                    <div className="space-y-2.5 mb-4">
                        {items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="text-[var(--brand-cream)]/60 text-sm font-body">
                                    {item.productName}{item.quantity > 1 ? ` ×${item.quantity}` : ''}
                                </span>
                                <span className="text-[var(--brand-cream)]/80 text-sm font-mono">₹{item.offerPrice * item.quantity}</span>
                            </div>
                        ))}
                        {appliedVoucher && (
                            <div className="flex justify-between items-center text-emerald-400">
                                <span className="text-sm font-mono">Voucher discount</span>
                                <span className="text-sm font-mono font-bold">-₹{voucherDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-[var(--brand-cream)]/60 text-sm font-body">Delivery</span>
                            <span className="text-[var(--brand-cream)]/80 text-sm font-mono">₹{DELIVERY_PRICE}</span>
                        </div>
                    </div>
                    <div className="border-t border-[var(--brand-border)] pt-4 flex justify-between items-center">
                        <div>
                            <p className="font-heading text-[var(--brand-cream)] text-lg">Total</p>
                            <p className="font-mono text-xs text-[var(--brand-cream)]/30">Inclusive of all taxes</p>
                        </div>
                        <span className="font-heading text-2xl text-[var(--brand-cream)]">₹{totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Pay button */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePaymentClick}
                        className="w-full mt-5 bg-[var(--brand-flame)] text-white py-4 rounded-xl font-heading font-bold text-base flex items-center justify-center gap-3 hover:bg-[#C94808] transition-colors shadow-[0_0_30px_rgba(232,88,10,0.3)] hover:shadow-[0_0_40px_rgba(232,88,10,0.45)]"
                    >
                        {paymentMode === 'online' ? 'Pay' : 'Place Order'}
                        <span className="font-mono font-normal text-sm opacity-70">₹{totalPrice.toFixed(2)}</span>
                    </motion.button>

                    <div className="mt-3 flex items-center justify-center gap-2 text-[var(--brand-cream)]/25 text-xs font-mono">
                        <Shield size={12} />
                        Secured by Razorpay
                    </div>
                </div>

            </div>

            <VoucherModal isOpen={isOpen} onOpenChange={onOpenChange} onOpen={onOpen} onValidVoucher={(v) => setAppliedVoucher(v)} onOpenVoucherAppliedModal={onVAOpen} />
            <VoucherAppliedModal isOpen={isVAOpen} onOpenChange={onVAOpenChange} voucherCode={appliedVoucher?.code || ''} discount={voucherDiscount} />
        </div>
    )
}

export default Checkout