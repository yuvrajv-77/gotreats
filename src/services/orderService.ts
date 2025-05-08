import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { OrderDetails, OrderData } from '../types/orderTypes';

export const handleCheckout = async (orderDetails: OrderDetails): Promise<boolean> => {
    try {
        const orderData: OrderData = {
            ...orderDetails,
            createdAt: new Date().toISOString(),
            paymentStatus: orderDetails.paymentStatus || 'pending',
            orderStatus: orderDetails.orderStatus || 'pending',
        };

        await addDoc(collection(db, 'orders'), orderData);
        return true;
    } catch (error) {
        console.error('Error placing order:', error);
        return false;
    }
};

// Fetch orders for a specific user (by UID)
export const fetchUserOrders = async (uid: string): Promise<OrderData[]> => {
    try {
        const userOrdersQuery = query(
            collection(db, 'orders'),
            where('customer.uid', '==', uid),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(userOrdersQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderData));
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return [];
    }
};

// Fetch all orders from Firestore
export const fetchAllOrders = async (): Promise<OrderData[]> => {
    try {
        const allOrdersQuery = query(
            collection(db, 'orders'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(allOrdersQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderData));
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw new Error('Failed to fetch orders');
    }
};

// Update order status in Firestore
export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<void> => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { orderStatus: newStatus });
    } catch (error) {
        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status');
    }
};


