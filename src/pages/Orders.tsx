import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button, { IconButton } from '../components/Button';
import OrderSummary from '../components/OrderSummary';
import { fetchUserOrders } from '../services/orderService';
import { useAuthStore } from '../store/authStore';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, ArrowRight, CheckCircle, CircleHelp, Home, RefreshCcw, Store, XIcon } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { useDisclosure } from '@/hooks/useDisclosure';
import { useCartStore } from '../store/cartStore'; // Import the cart store
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const userDetails = useAuthStore((state) => state.userDetails);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate()

    useEffect(() => window.scrollTo(0, 0), [])

    // Use React Query to fetch orders
    const { data: orders = [], isLoading, isError } = useQuery({
        queryKey: ['userOrders', userDetails?.uid], // Query key
        queryFn: () => fetchUserOrders(userDetails?.uid), // Fetch function
        enabled: !!userDetails?.uid, // Only fetch if userDetails.uid exists
        refetchInterval: 5000, // Polling every 5 seconds for real-time updates
    });

    if (isLoading) {
        return <div className='text-center py-10'>Loading orders...</div>;
    }

    if (isError) {
        return <div className='text-center py-10 text-red-500'>Failed to load orders. Please try again later.</div>;
    }

    // Sort orders: prioritize non-delivered orders, then by creation date (most recent first)
    const sortedOrders = [...orders].sort((a, b) => {
        if (a.orderStatus !== 'delivered' && b.orderStatus === 'delivered') return -1;
        if (a.orderStatus === 'delivered' && b.orderStatus !== 'delivered') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const formattedAddress = `${selectedOrder?.address.flatNumber}, ${selectedOrder?.address.buildingName}, 
    ${selectedOrder?.address.streetAddress}, ${selectedOrder?.address.area}, ${selectedOrder?.address.pincode}`;

    // Get dynamic border color based on order status
    const getBorderColor = (status: string) => {
        switch (status) {
            case 'received':
                return 'border-orange-500';
            case 'preparing':
                return 'border-yellow-500';
            case 'out for delivery':
                return 'border-blue-500';
            case 'delivered':
                return 'border-green-700';
            case 'cancelled':
                return 'border-red-500';
            case 'pending':
                return 'border-gray-400';
            case 'failed':
                return 'border-red-400';
            default:
                return 'border-gray-300';
        }
    };

    // Get dynamic background color based on order status
    const getBackgroundColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100';
            case 'cancelled':
                return 'bg-red-50'; // Distinct background for cancelled and failed orders
            case 'failed':
                return 'bg-red-100'; // Distinct background for cancelled and failed orders
            default:
                return 'bg-white'; // Gradient for other non-delivered orders
        }
    };

    return (
        <div className='md:bg-gray-100 min-h-screen'>
            <div className='max-w-3xl px-5 mx-auto'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-3xl md:text-4xl font-semibold lancelot py-5 md:py-10 text-gray-700'>Past Orders</h1>
                    <button className='flex justify-between items-center gap-2 p-1 rounded-full hover:bg-gray-200 underline text-green-600 cursor-pointer'
                        onClick={() => navigate('/contact')}>
                        <CircleHelp size={18} />
                    </button>
                </div>
                {sortedOrders.length === 0 ? (
                    <div className='flex flex-col items-center gap-5 py-10 text-gray-500'>
                        <p>You have not placed any order yet.</p>
                        <Button variant='primary' onClick={() => navigate('/shop')}>Lets Order Now</Button>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className='flex flex-col gap-5'>
                            {sortedOrders.map((order, i) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -50 }} // Mount animation: from top
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: i * 0.1 }}
                                    className={`md:p-8 p-5 w-full border rounded-xl border-l-5 ${getBorderColor(order.orderStatus)} ${getBackgroundColor(order.orderStatus)}`}
                                >
                                    <div className='flex flex-col gap-4 justify-between'>
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <h4 className='mb-1 text-lg font-semibold md:text-xl'>Order #{order.id.slice(-6)}</h4>
                                                <div className='flex text-sm gap-2 text-neutral-500 items-center '>
                                                    <p>{new Date(order.createdAt).toLocaleDateString()}</p> |
                                                    <p>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={order.orderStatus} />
                                        </div>

                                        <div className='text-neutral-700 md:px-20'>
                                            {order.items.map((item: any, idx: number) => (
                                                <h2 key={idx} className='text-sm flex justify-between'>
                                                    {item.productName} <span className='font-semibold'>X {item.quantity}</span>
                                                </h2>
                                            ))}
                                        </div>

                                        <div className='flex justify-between items-center'>
                                            <p className='text-neutral-600 text-lg'>
                                                Total Paid: <span className='font-bold text-neutral-800'>₹ {order.totalAmount}</span>
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    // setDetailOpen(true);
                                                    onOpen();
                                                }}
                                                className='text-orange-600 font-semibold inline-flex items-center gap-2 hover:underline cursor-pointer'
                                            >
                                                View Details <ArrowRight size={16} />
                                            </button>

                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
            {/* ----- order details for mobile ----- */}
            <Drawer isOpen={isOpen} onOpenChange={onClose} className='shadow-xl' backdrop='blur'>
                <DrawerContent className='bg-white z-100 '>
                    {(onClose) => (
                        <div className='flex flex-col h-full justify-between '>
                            <div>
                                <DrawerHeader className="flex items-center gap-1 bg-white  border-b fixed top-0 w-full z-[100] shadow-sm">
                                    <IconButton><ArrowLeft size={20} onClick={onClose} /></IconButton>
                                    <p> Order #{selectedOrder?.id}</p>

                                </DrawerHeader>
                                <DrawerBody className="h-full overflow-auto mt-20">
                                    <div className="flex flex-col gap-4 items-start border-b pb-4">
                                        <div className="flex flex-col text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                                                <Store size={19} /> <p className="text-green-500 font-bold comfortaa"><span className="text-orange-600">go</span>treats</p>
                                            </span>
                                            <p>Mahavir Nagar</p>
                                        </div>

                                        <div className="flex flex-col text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                                                <Home size={19} /> Home
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {selectedOrder?.customer?.name || 'N/A'}
                                            </span>
                                            <p>{formattedAddress || 'No address found'}</p>
                                        </div>

                                        <StatusBadge status={selectedOrder?.orderStatus} />
                                        {
                                            selectedOrder?.orderStatus === 'cancelled' && (
                                                <p className='text-sm text-red-500'>Order Cancelled | Refund will be initiated soon</p>
                                            )
                                        }
                                    </div>

                                    <div className="mt-4 border-b pb-4">
                                        <h3 className="font-medium text-sm text-gray-800">Order Items</h3>
                                        <div className="mt-2 flex flex-col gap-2">
                                            {selectedOrder?.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center pl-2">
                                                    <span>
                                                        {item.productName} x {item.quantity}
                                                    </span>
                                                    <span>₹{item.offerPrice * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bill Details Section */}
                                    <div className="pb-2 border-b text-gray-700 text-sm">
                                        <div className="flex justify-between py-1">
                                            <span>Item Total</span>
                                            <span>₹{selectedOrder?.grossTotalPrice || '0.00'}</span>
                                        </div>
                                        {/* <div className="flex justify-between py-1">
                                            <span>Taxes (18%)</span>
                                            <span>
                                                ₹
                                                {selectedOrder?.gst}
                                            </span>
                                        </div> */}
                                        <div className="flex justify-between py-1">
                                            <span>Delivery Charges</span>
                                            <span>₹{selectedOrder?.deliveryCharge || '0.00'}</span>
                                        </div>

                                    </div>

                                    {/* Total Paid Section */}
                                    <div className="flex justify-between text-gray-800 font-semibold text-lg mt-4">
                                        <span>Total Paid</span>
                                        <span>₹{selectedOrder?.totalAmount || '0.00'}</span>
                                    </div>

                                    <div>
                                        <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                                            <CheckCircle size={16} />
                                            <p>
                                                {selectedOrder.paymentStatus === 'success'
                                                    ? `Paid on ${new Date(selectedOrder.createdAt).toLocaleString()}`
                                                    : 'No payment information available'}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2 justify-between text-sm text-gray-700 mt-2'>
                                            <p>Transaction ID: </p>
                                            <p>{selectedOrder?.razorpay_payment_id || 'N/A'}</p>
                                        </div>
                                    </div>

                                </DrawerBody>
                            </div>
                            <DrawerFooter className='flex border-t-2 gap-2'>

                                <Button variant="secondary" className='w-full' onClick={onClose}>
                                    <XIcon size={16} /> Close
                                </Button>
                            </DrawerFooter>
                        </div>
                    )}
                </DrawerContent >
            </Drawer >
            {/* {detailOpen && selectedOrder && (
                <div className='w-full h-screen fixed backdrop-blur-sm inset-0 z-10' onClick={() => setDetailOpen(false)}>
                    <OrderSummary 
                    setDetailOpen={setDetailOpen} 
                    detailOpen={detailOpen} 
                    order={selectedOrder} />
                </div>
            )} */}
        </div >
    );
};

export default Orders;