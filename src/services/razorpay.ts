import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';


export const initializeRazorpayPayment = async (
    user,
    userDetails,
    totalPrice,
    items,
    shippingAddress
) => {
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
        throw new Error('Razorpay SDK failed to load');
    }

    const orderData = {
        amount: totalPrice * 100,
        currency: 'INR',
        userId: user.uid,
        items,
        status: 'pending',
        createdAt: new Date(),
        shippingAddress,
    };

    const orderRef = await addDoc(collection(db, 'orders'), orderData);

    return {
        key: import.meta.env.VITE_RAZORPAY_ID,
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'Go Treats',
        description: `Order #${orderRef.id}`,
        order_id: orderRef.id,
        prefill: {
            name: userDetails?.displayName || '',
            email: userDetails?.email || '',
            contact: userDetails?.phoneNumber || '',
        },
        handler: async (response) => {
            await updateDoc(doc(db, 'orders', orderRef.id), {
                status: 'completed',
                paymentId: response.razorpay_payment_id,
                paymentTimestamp: new Date()
            });
            return orderRef.id;
        },
        modal: {
            ondismiss: async () => {
                await updateDoc(doc(db, 'orders', orderRef.id), {
                    status: 'cancelled'
                });
            }
        }
    };
};
