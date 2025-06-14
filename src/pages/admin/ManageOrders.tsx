import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllOrders, updateOrderStatus } from '../../services/orderService';
import OrderCard from '../../components/OrderCard';
import { AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import { addToast, cn } from '@heroui/react';
import { Box, X } from 'lucide-react';

const ManageOrders = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Delivered' | 'Failed' | 'Cancelled' | 'All'>('Active');
  const [previousOrderCount, setPreviousOrderCount] = useState(0); // Track previous order count
  const queryClient = useQueryClient();

  // Fetch all orders using React Query
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchAllOrders,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  useEffect(() => {
    if (orders.length > previousOrderCount) {
      // addToast({
      //   title: 'New Order Arrived !',
      //   color: 'primary',
      //   shouldShowTimeoutProgress: true,
      //   timeout: 3000,
      //   classNames: {
      //     closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 stroke-2 text-orange-500",
      //     base: cn([
      //       "bg-orange-100 shadow-lg",
      //       "flex flex-col items-start",
      //       "p-4 rounded-lg",
      //     ]),
      //     title: cn([
      //       "text-lg font-semibold text-orange-600",
      //     ]),
      //     icon: (
      //       "fill-none animate-pulse stroke-2 text-orange-600"
      //     )
      //   },
      //   closeIcon: (
      //     <X size={32} />
      //   ),
      //   icon: (
      //     <Box size={32} />
      //   )
      // });
    }
    setPreviousOrderCount(orders.length); // Update the previous order count
  }, [orders, previousOrderCount]);

  // Mutation for updating order status
  const mutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: string }) =>
      updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // Refetch admin orders
      queryClient.invalidateQueries({ queryKey: ['userOrders'] }); // Refetch user orders
      addToast({
        title: 'Order Status Updated',
        color: 'default',
        shouldShowTimeoutProgress: true,
        timeout: 2000,
        hideIcon: true,
        classNames: {
          closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 stroke-2",


        },
        closeIcon: (
          <X size={32} />
        ),

      });
    },
  });

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    mutation.mutate({ orderId, newStatus });
  };

  // Filter and sort orders based on the active tab
  const filteredOrders = orders
    .filter(order => {
      switch (activeTab) {
        case 'Active':
          return (
            order.orderStatus === 'received' ||
            order.orderStatus === 'preparing' ||
            order.orderStatus === 'out for delivery'
          );
        case 'Delivered':
          return order.orderStatus === 'delivered';
        case 'Failed':
          return order.orderStatus === 'failed';
        case 'Cancelled':
          return order.orderStatus === 'cancelled';
        case 'All':
          return true; // Show all orders
        default:
          return false;
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by latest date

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error loading orders.</div>;

  return (
    <div className="md:mx-4 w-full">
      <h1 className="md:text-4xl text-3xl font-bold text-center md:text-start lancelot mb-4 md:mb-6 text-white">
        Manage Orders
      </h1>
      <div className="flex justify-center items-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-full ${activeTab === 'Active' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          onClick={() => setActiveTab('Active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'Delivered' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          onClick={() => setActiveTab('Delivered')}
        >
          Delivered
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'Failed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          onClick={() => setActiveTab('Failed')}
        >
          Failed
        </button>
        <button
          className={`px-4 py-2 rounded-r-full ${activeTab === 'Cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          onClick={() => setActiveTab('Cancelled')}
        >
          Cancelled
        </button> 
        {/* <button
          className={`px-4 py-2 rounded-r-full ${activeTab === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          onClick={() => setActiveTab('All')}
        >
          All
        </button> */}
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {
            filteredOrders.length === 0 ? (
              <div className="text-center my-20 text-gray-500 animate-bounce capitalize">
                Looks Like there are no {activeTab.toLowerCase()} orders yet.
              </div>
            ) : null
          }
          {
            filteredOrders.map((order, i) => (
              <OrderCard key={i} order={order} i={i} onUpdateStatus={handleUpdateStatus} />
            ))
          }
        </AnimatePresence>
      </div>
     
    </div>
  );
};

export default ManageOrders;