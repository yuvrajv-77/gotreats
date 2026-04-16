import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { Trash, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types/CartTypes';
import { useCartStore } from '../store/cartStore';

interface CartSectionProps {
    items: CartItem[];
    updateItemQuantity: (itemId: string, quantity: number) => void;
}

const CartSection: React.FC<CartSectionProps> = ({ items, updateItemQuantity }) => {
    const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
    const clearCart = useCartStore((state) => state.clearCart);

    const handleClearCart = () => {
        clearCart();
        setShowClearCartConfirm(false);
    };

    const handleRemoveItem = () => {
        if (itemToRemove) {
            updateItemQuantity(itemToRemove.id, 0);
            setItemToRemove(null);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Header (Optional clear cart) */}
            {items.length > 0 && (
                <div className="flex justify-end px-5 pt-3 pb-1">
                    <button 
                        onClick={() => setShowClearCartConfirm(true)} 
                        className="text-[var(--brand-flame)]/70 hover:text-[var(--brand-flame)] flex items-center gap-1.5 text-xs font-mono transition-colors"
                    >
                        <Trash size={14} /> Clear Cart
                    </button>
                </div>
            )}

            {/* Cart Items */}
            <div className="flex flex-col divide-y divide-[var(--brand-border)]">
                {items.map((item) => (
                    <div key={item.id} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                        <img 
                            src={item.imageUrl} 
                            alt={item.productName} 
                            className="w-16 h-16 object-cover rounded-xl border border-[var(--brand-border)]" 
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-[var(--brand-cream)] text-sm line-clamp-1">{item.productName}</h3>
                            <p className="text-[var(--brand-cream)]/50 text-xs font-mono mt-1">₹{item.offerPrice}</p>
                        </div>
                        <div className="flex items-center rounded-xl bg-[var(--brand-dark)] border border-[var(--brand-border)] overflow-hidden shrink-0">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="px-2 py-1.5 text-[var(--brand-flame)] hover:bg-white/5 transition-colors"
                                onClick={() => {
                                    if (item.quantity === 1) {
                                        setItemToRemove(item);
                                    } else {
                                        updateItemQuantity(item.id, item.quantity - 1);
                                    }
                                }}
                            >
                                <Minus size={14} />
                            </motion.button>
                            <span className="font-mono font-bold text-[var(--brand-cream)] text-xs min-w-[24px] text-center">{item.quantity}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="px-2 py-1.5 text-[var(--brand-flame)] hover:bg-white/5 transition-colors"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            >
                                <Plus size={14} />
                            </motion.button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Clear Cart Confirmation Modal */}
            <Modal
                isOpen={showClearCartConfirm}
                title="Clear Cart"
                message="Are you sure you want to remove all items from your cart? This action cannot be undone."
                confirmLabel="Clear Cart"
                cancelLabel="Cancel"
                onConfirm={handleClearCart}
                onCancel={() => setShowClearCartConfirm(false)}
            />

            {/* Remove Item Confirmation Modal */}
            <Modal
                isOpen={!!itemToRemove}
                title="Remove Item"
                message={`Are you sure you want to remove "${itemToRemove?.productName}" from your cart?`}
                confirmLabel="Remove"
                cancelLabel="Cancel"
                onConfirm={handleRemoveItem}
                onCancel={() => setItemToRemove(null)}
            />
        </div>
    );
};

export default CartSection;