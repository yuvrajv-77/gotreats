import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { Trash, Pencil, X, Send } from 'lucide-react';
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
		<div className="bg-white rounded-xl shadow-sm overflow-hidden">
			<div className="p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Cart ({items.reduce((total, item) => total + item.quantity, 0)} items)</h2>
					<button onClick={() => setShowClearCartConfirm(true)} className="text-gray-500 hover:text-red-500">
						<Trash />
					</button>
				</div>

				{/* Cart Items */}
				<div className="space-y-6">

					{items.map((item) => {

						return (
							<div key={item.id} className="flex flex-col gap-3">
								<div className="flex items-center gap-4">
									<img src={item.imageUrl} alt={item.productName} className="size-15 object-cover rounded-lg" />
									<div className="flex-1">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-medium">{item.productName}</h3>
												<p className="text-gray-500">₹{item.offerPrice}</p>
											</div>
											<div className="flex items-center gap-4">
												<div className="bg-gray-100 rounded-lg flex items-center">
													<motion.button
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.95 }}
														className="px-3 py-1 text-orange-500 hover:text-orange-600 transition-colors"
														onClick={() => {
															if (item.quantity === 1) {
																setItemToRemove(item);
															} else {
																updateItemQuantity(item.id, item.quantity - 1);
															}
														}}
													>
														-
													</motion.button>
													<span className="px-3 py-1 min-w-[2rem] text-center">{item.quantity}</span>
													<motion.button
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.95 }}
														className="px-3 py-1 text-orange-500 hover:text-orange-600 transition-colors"
														onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
													>
														+
													</motion.button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Clear Cart Confirmation Modal */}
			<Modal
				isOpen={showClearCartConfirm}
				title="Clear Cart?"
				message="Are you sure you want to remove all items from your cart? This action cannot be undone."
				confirmLabel="Clear Cart"
				cancelLabel="Cancel"
				onConfirm={handleClearCart}
				onCancel={() => setShowClearCartConfirm(false)}
			/>

			{/* Remove Item Confirmation Modal */}
			<Modal
				isOpen={!!itemToRemove}
				title="Remove Item?"
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