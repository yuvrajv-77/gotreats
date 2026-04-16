import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button, { IconButton } from '../components/Button';
import { fetchUserOrders } from '../services/orderService';
import { useAuthStore } from '../store/authStore';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, ArrowRight, CheckCircle, CircleHelp, HandCoins, Home, Store, XIcon } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { useDisclosure } from '@/hooks/useDisclosure';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const userDetails = useAuthStore((state) => state.userDetails);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate()

    useEffect(() => window.scrollTo(0, 0), [])

    const { data: orders = [], isLoading, isError } = useQuery({
        queryKey: ['userOrders', userDetails?.uid],
        queryFn: () => fetchUserOrders(userDetails?.uid),
        enabled: !!userDetails?.uid,
        refetchInterval: 5000,
    });

    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const statusAccent: Record<string, string> = {
        received: 'border-l-orange-500',
        preparing: 'border-l-yellow-500',
        'out for delivery': 'border-l-blue-500',
        delivered: 'border-l-emerald-500',
        cancelled: 'border-l-red-500',
        failed: 'border-l-red-400',
        pending: 'border-l-[var(--brand-border)]',
    };

    const formattedAddress = selectedOrder
        ? `${selectedOrder.address.flatNumber}, ${selectedOrder.address.buildingName}, ${selectedOrder.address.streetAddress}, ${selectedOrder.address.area} – ${selectedOrder.address.pincode}`
        : '';

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh] bg-[var(--brand-dark)]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[var(--brand-flame)] border-t-transparent rounded-full animate-spin" />
                <p className="font-mono text-sm text-[var(--brand-cream)]/40">Loading orders…</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--brand-dark)]">
            <div className="max-w-2xl mx-auto px-4 py-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading text-3xl text-[var(--brand-cream)]">My Orders</h1>
                        <p className="font-mono text-xs text-[var(--brand-cream)]/30 mt-1">{sortedOrders.length} orders total</p>
                    </div>
                    <button
                        onClick={() => navigate('/contact')}
                        className="p-2 rounded-xl border border-[var(--brand-border)] text-[var(--brand-cream)]/40 hover:text-[var(--brand-flame)] hover:border-[var(--brand-flame)]/30 transition-colors"
                    >
                        <CircleHelp size={18} />
                    </button>
                </div>

                {sortedOrders.length === 0 ? (
                    <div className="flex flex-col items-center gap-5 py-24 text-center">
                        <div className="text-5xl">📦</div>
                        <p className="font-heading text-xl text-[var(--brand-cream)]/60">No orders yet</p>
                        <p className="font-mono text-sm text-[var(--brand-cream)]/30">Place your first order!</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-6 py-3 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold hover:bg-[#C94808] transition-colors"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="flex flex-col gap-3">
                            {sortedOrders.map((order, i) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: i * 0.06 }}
                                    className={`bg-[var(--brand-charcoal)] border border-[var(--brand-border)] border-l-4 ${statusAccent[order.orderStatus] ?? 'border-l-[var(--brand-border)]'} rounded-2xl p-5`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-heading text-[var(--brand-cream)] text-base">Order #{order.id.slice(-6)}</p>
                                            <p className="font-mono text-xs text-[var(--brand-cream)]/30 mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.orderStatus} />
                                    </div>

                                    <div className="space-y-1 mb-4 pl-0.5">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <span className="text-[var(--brand-cream)]/60 text-sm font-body">{item.productName}</span>
                                                <span className="font-mono text-xs text-[var(--brand-cream)]/30">×{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-[var(--brand-border)] pt-3">
                                        <div>
                                            <span className="text-[var(--brand-cream)]/40 text-xs font-mono mr-1">
                                                {order.paymentStatus === 'pending' && order?.orderStatus !== 'delivered' ? 'To Pay' : 'Paid'}
                                            </span>
                                            <span className="font-heading text-[var(--brand-cream)]">₹{order.totalAmount}</span>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedOrder(order); onOpen(); }}
                                            className="flex items-center gap-1.5 text-[var(--brand-flame)] text-xs font-mono hover:underline"
                                        >
                                            Details <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>

            {/* Detail Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={onClose} backdrop='blur'>
                <DrawerContent className="bg-[var(--brand-charcoal)] border-l border-[var(--brand-border)]">
                    {(onClose) => (
                        <div className="flex flex-col h-full">
                            <DrawerHeader className="flex items-center gap-2 border-b border-[var(--brand-border)] px-5 py-4">
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--brand-cream)]/50 transition-colors">
                                    <ArrowLeft size={18} />
                                </button>
                                <p className="font-heading text-[var(--brand-cream)]">Order #{selectedOrder?.id?.slice(-6)}</p>
                            </DrawerHeader>

                            <DrawerBody className="flex-1 overflow-auto px-5 py-5 space-y-5">
                                {/* Route */}
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-7 h-7 rounded-full bg-[var(--brand-flame)]/15 border border-[var(--brand-flame)]/30 flex items-center justify-center">
                                            <Store size={13} className="text-[var(--brand-flame)]" />
                                        </div>
                                        <div className="w-px flex-1 bg-[var(--brand-border)] my-1" />
                                        <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                                            <Home size={13} className="text-emerald-400" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between py-0.5">
                                        <div>
                                            <p className="font-heading text-[var(--brand-cream)] text-sm">GoTreats Kitchen</p>
                                            <p className="font-mono text-xs text-[var(--brand-cream)]/30">Borivali West</p>
                                        </div>
                                        <div>
                                            <p className="font-heading text-[var(--brand-cream)] text-sm mt-2">{selectedOrder?.customer?.name}</p>
                                            <p className="font-mono text-xs text-[var(--brand-cream)]/30 leading-relaxed">{formattedAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[var(--brand-border)] pt-4">
                                    <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-3">Order Items</p>
                                    <div className="space-y-2">
                                        {selectedOrder?.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <span className="text-[var(--brand-cream)]/70 text-sm font-body">{item.productName} ×{item.quantity}</span>
                                                <span className="font-mono text-sm text-[var(--brand-cream)]/60">₹{item.offerPrice * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-[var(--brand-border)] pt-4 space-y-2">
                                    <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-3">Bill</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--brand-cream)]/50 font-body">Item total</span>
                                        <span className="font-mono text-[var(--brand-cream)]/70">₹{selectedOrder?.grossTotalPrice}</span>
                                    </div>
                                    {selectedOrder?.voucherDiscount && (
                                        <div className="flex justify-between text-sm text-emerald-400">
                                            <span className="font-body">Voucher</span>
                                            <span className="font-mono">-₹{selectedOrder.voucherDiscount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--brand-cream)]/50 font-body">Delivery</span>
                                        <span className="font-mono text-[var(--brand-cream)]/70">₹{selectedOrder?.deliveryCharge}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-heading pt-2 border-t border-[var(--brand-border)]">
                                        <span className="text-[var(--brand-cream)]">Total</span>
                                        <span className="text-[var(--brand-cream)]">₹{selectedOrder?.totalAmount}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    {selectedOrder?.paymentStatus === 'success'
                                        ? <><CheckCircle size={14} className="text-emerald-400" /><span className="text-emerald-400 font-mono text-xs">Paid on {new Date(selectedOrder.createdAt).toLocaleDateString()}</span></>
                                        : <><HandCoins size={14} className="text-[var(--brand-amber)]" /><span className="text-[var(--brand-amber)] font-mono text-xs">Cash on Delivery</span></>
                                    }
                                </div>

                                {selectedOrder?.note && (
                                    <div className="rounded-xl border border-[var(--brand-border)] p-3">
                                        <p className="font-mono text-[10px] text-[var(--brand-cream)]/30 uppercase tracking-widest mb-1">Note</p>
                                        <p className="text-[var(--brand-cream)]/60 text-sm italic">"{selectedOrder.note}"</p>
                                    </div>
                                )}
                            </DrawerBody>

                            <DrawerFooter className="border-t border-[var(--brand-border)] px-5 py-4">
                                <Button variant="secondary" className="w-full" onClick={onClose} size="sm">
                                    <XIcon size={14} /> Close
                                </Button>
                            </DrawerFooter>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default Orders;