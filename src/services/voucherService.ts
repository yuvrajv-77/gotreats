import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Voucher } from '../types/voucherTypes';

export const createVoucher = async (voucher: Voucher): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'vouchers'), voucher);
        return docRef.id;
    } catch (error) {
        console.error('Error creating voucher:', error);
        throw new Error('Failed to create voucher');
    }
};

export const getVouchers = async () => {
    try {
        const vouchersRef = collection(db, 'vouchers');
        const q = query(vouchersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const now = new Date();

        // Use Promise.all to handle async updates
        const vouchers = await Promise.all(querySnapshot.docs.map(async docSnap => {
            const voucher = { id: docSnap.id, ...docSnap.data() } as Voucher;

            // Check expiry
            let expiry: Date | null = null;
            if (voucher.expiryDate) {
                if (typeof (voucher.expiryDate as any).toDate === 'function') {
                    expiry = (voucher.expiryDate as any).toDate();
                } else {
                    expiry = new Date(voucher.expiryDate as any);
                }
            }

            if (
                expiry &&
                expiry.getTime() < now.getTime() &&
                voucher.status !== 'expired'
            ) {
                // Update status in Firestore if expired
                await updateDoc(doc(db, 'vouchers', voucher.id!), { status: 'expired' });
                voucher.status = 'expired';
            }

            return voucher;
        }));

        return vouchers;
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        throw new Error('Failed to fetch vouchers');
    }
};

export const getVoucherByCode = async (code: string) => {
    try {
        const vouchersRef = collection(db, 'vouchers');
        const q = query(vouchersRef, where('code', '==', code));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null; // No voucher found with the given code
        }
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Voucher;
    } catch (error) {
        console.error('Error fetching voucher by code:', error);
        throw new Error('Failed to fetch voucher by code');
    }
}

export const validateVoucher = (
    voucher: Voucher,
    userPhone: string,
    cartTotal: number
): string | null => {
    const now = new Date();

    if (voucher.status !== 'active') return 'Voucher Not Found.';

    // Handle Firestore Timestamp, string, or JS Date for startDate and expiryDate
    let start: Date | null = null;
    let expiry: Date | null = null;

    if (voucher.startDate) {
        if (typeof (voucher.startDate as any).toDate === 'function') {
            start = (voucher.startDate as any).toDate();
        } else {
            start = new Date(voucher.startDate as any);
        }
        if (start.getTime() > now.getTime()) return 'Voucher Not Found.';
    }

    if (voucher.expiryDate) {
        if (typeof (voucher.expiryDate as any).toDate === 'function') {
            expiry = (voucher.expiryDate as any).toDate();
        } else {
            expiry = new Date(voucher.expiryDate as any);
        }
        if (expiry.getTime() < now.getTime()) return 'Voucher Has Expired.';
    }

    if (voucher.currentUses !== undefined && voucher.currentUses >= voucher.maxUses)
        return 'Voucher usage limit reached.';

    if (voucher.minOrderValue && cartTotal < voucher.minOrderValue)
        return `Minimum order value must be ₹${voucher.minOrderValue} to use this voucher.`;

    // Scope check
    if (
        voucher.scope === 'specific' &&
        (!voucher.allowedUsers || !voucher.allowedUsers.includes(userPhone))
    ) {
        return 'Voucher Not Found.';
    }

    // Single use per customer check
    if (
        voucher.singleUsePerCustomer &&
        voucher.userUsage?.[userPhone] &&
        voucher.userUsage[userPhone] > 0
    ) {
        return 'You have already used this voucher.';
    }

    return null; // No issues
};


export const updateVoucherAfterOrder = async (voucher: Voucher, userPhone: string) => {
    if (!voucher.id) return;

    const voucherRef = doc(db, 'vouchers', voucher.id);

    // Increment currentUses
    const newCurrentUses = (voucher.currentUses || 0) + 1;

    // Update userUsage: increment if exists, else set to 1
    const userUsage = { ...(voucher.userUsage || {}) };
    userUsage[userPhone] = (userUsage[userPhone] || 0) + 1;

    // Check for expiry or maxUses
    let status = voucher.status;
    const now = new Date();

    // Check maxUses
    if (newCurrentUses >= voucher.maxUses) {
        status = 'expired';
    }

    // Check expiryDate
    if (voucher.expiryDate) {
        let expiry: Date;
        if (typeof (voucher.expiryDate as any).toDate === 'function') {
            expiry = (voucher.expiryDate as any).toDate();
        } else {
            expiry = new Date(voucher.expiryDate as any);
        }
        if (expiry.getTime() < now.getTime()) {
            status = 'expired';
        }
    }

    await updateDoc(voucherRef, {
        currentUses: newCurrentUses,
        userUsage,
        status,
    });
};


export const updateVoucherStatus = async (voucherId: string, status: 'active' | 'inactive') => {
    const voucherRef = doc(db, 'vouchers', voucherId);
    await updateDoc(voucherRef, { status });
};

export const deleteVoucher = async (voucherId: string) => {
    const voucherRef = doc(db, 'vouchers', voucherId);
    await deleteDoc(voucherRef);
};