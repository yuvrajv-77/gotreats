import { Star, Triangle, Plus, Minus } from 'lucide-react'
import { Item } from '../types/ItemsTypes'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Image } from '@heroui/react'
import {
    Drawer, DrawerContent, DrawerBody, DrawerFooter, useDisclosure,
} from "@heroui/react";

const VegDot = ({ isNonVeg }: { isNonVeg: boolean }) => (
    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isNonVeg ? 'border-red-700 bg-red-950/40' : 'border-green-600 bg-green-950/40'}`}>
        {isNonVeg
            ? <Triangle size={7} className="text-red-500 fill-red-500" />
            : <div className="w-2 h-2 rounded-full bg-green-500" />
        }
    </div>
)

const ItemCards = ({ item }: { item: Item }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { items, addItem, updateQuantity } = useCartStore()
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const cartItem = items.find(i => i.id === item.id)
    const quantity = cartItem?.quantity || 0

    const handleIncrement = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (quantity === 0) addItem(item);
        else updateQuantity(item.id, quantity + 1);
    }
    const handleDecrement = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (quantity > 0) updateQuantity(item?.id, quantity - 1);
    }

    const discount = item.originalPrice > item.offerPrice
        ? Math.round((1 - item.offerPrice / item.originalPrice) * 100)
        : 0;

    const QuantityControl = ({ compact = false }) => {
        if (!user) {
            return (
                <button
                    onClick={() => navigate('/register')}
                    className="px-3 py-1.5 rounded-lg bg-[var(--brand-flame)]/10 border border-[var(--brand-flame)]/20 text-[var(--brand-flame)] text-xs font-mono hover:bg-[var(--brand-flame)]/20 transition-colors"
                >
                    Login to add
                </button>
            )
        }
        if (quantity === 0) {
            return (
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleIncrement}
                    className={`flex items-center gap-1 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold hover:bg-[#C94808] transition-colors shadow-[0_0_16px_rgba(232,88,10,0.3)] ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
                >
                    <Plus size={compact ? 12 : 14} />
                    Add
                </motion.button>
            )
        }
        return (
            <div className="flex items-center rounded-xl bg-[var(--brand-charcoal)] border border-[var(--brand-border)] overflow-hidden">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecrement}
                    className={`flex items-center justify-center text-[var(--brand-flame)] hover:bg-white/5 transition-colors ${compact ? 'px-2 py-1' : 'px-3 py-2'}`}
                >
                    <Minus size={compact ? 12 : 14} />
                </motion.button>
                <span className={`font-mono font-bold text-[var(--brand-cream)] min-w-[24px] text-center ${compact ? 'text-xs px-1' : 'text-sm px-2'}`}>{quantity}</span>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleIncrement}
                    className={`flex items-center justify-center text-[var(--brand-flame)] hover:bg-white/5 transition-colors ${compact ? 'px-2 py-1' : 'px-3 py-2'}`}
                >
                    <Plus size={compact ? 12 : 14} />
                </motion.button>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* ── Desktop card ── */}
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="hidden md:flex flex-col w-64 lg:w-68 bg-[var(--brand-charcoal)] border border-[var(--brand-border)] rounded-2xl overflow-hidden hover:border-[var(--brand-flame)]/30 transition-all group cursor-pointer"
            >
                {/* Image */}
                <div className="relative h-48 overflow-hidden" onClick={onOpen}>
                    {!imgLoaded && (
                        <div className="absolute inset-0 bg-[var(--brand-border)] animate-pulse flex items-center justify-center">
                            <span className="font-heading text-2xl text-[var(--brand-cream)]/20">Bitebox</span>
                        </div>
                    )}
                    <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        disableSkeleton
                    />
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[var(--brand-flame)] text-white text-xs font-mono font-bold">
                            -{discount}%
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <VegDot isNonVeg={item.isNonVeg} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                        <h4 className="font-heading text-[var(--brand-cream)] text-base leading-tight mb-1 line-clamp-1">{item.productName}</h4>
                        <div className="flex items-center gap-1 mb-2">
                            <Star size={11} fill="var(--brand-amber)" stroke="none" />
                            <span className="font-mono text-xs text-[var(--brand-cream)]/50">{item.rating}</span>
                        </div>
                        <p className="text-[var(--brand-cream)]/40 text-xs leading-relaxed line-clamp-2">{item.productDescription}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-heading text-[var(--brand-cream)] text-base">₹{item.offerPrice}</span>
                            {item.originalPrice > item.offerPrice && (
                                <span className="text-[var(--brand-cream)]/30 text-xs line-through font-mono">₹{item.originalPrice}</span>
                            )}
                        </div>
                        <QuantityControl compact />
                    </div>
                </div>
            </motion.div>

            {/* ── Mobile card ── */}
            <div className="flex md:hidden items-center gap-3 px-4 py-4 bg-[var(--brand-charcoal)] border-b border-[var(--brand-border)] w-full">
                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <VegDot isNonVeg={item.isNonVeg} />
                        <h4 className="font-heading text-[var(--brand-cream)] text-sm leading-tight line-clamp-1">{item.productName}</h4>
                    </div>
                    <div className="flex items-center gap-1 mb-1.5">
                        <Star size={10} fill="var(--brand-amber)" stroke="none" />
                        <span className="font-mono text-[10px] text-[var(--brand-cream)]/40">{item.rating}</span>
                    </div>
                    <p className="text-[var(--brand-cream)]/40 text-xs line-clamp-2 leading-relaxed">{item.productDescription}</p>
                    <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="font-heading text-[var(--brand-cream)] text-sm">₹{item.offerPrice}</span>
                        {item.originalPrice > item.offerPrice && (
                            <span className="text-[var(--brand-cream)]/30 text-xs line-through font-mono">₹{item.originalPrice}</span>
                        )}
                    </div>
                </div>

                {/* Right — image + qty */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative w-28 h-24 rounded-xl overflow-hidden" onClick={onOpen}>
                        <img
                            src={item.imageUrl}
                            alt={item.productName}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                        {discount > 0 && (
                            <div className="absolute bottom-1 left-1 px-1.5 py-px rounded-full bg-[var(--brand-flame)] text-white text-[9px] font-mono font-bold">
                                -{discount}%
                            </div>
                        )}
                    </div>
                    <QuantityControl compact />
                </div>
            </div>

            {/* ── Image Detail Drawer ── */}
            <Drawer isOpen={isOpen} placement='bottom' size='lg' hideCloseButton onOpenChange={onOpenChange}>
                <DrawerContent className="bg-[var(--brand-dark)] border-t border-[var(--brand-border)]">
                    {(onClose) => (
                        <>
                            <DrawerBody className="pt-0 px-0">
                                <div className="relative h-64 md:h-80">
                                    <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.productName} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark)] to-transparent" />
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--brand-dark)]/80 flex items-center justify-center text-[var(--brand-cream)] hover:bg-[var(--brand-charcoal)] transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="px-5 py-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <VegDot isNonVeg={item.isNonVeg} />
                                        {discount > 0 && <span className="pill pill-flame text-[10px]">-{discount}% off</span>}
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-display italic text-[var(--brand-cream)] text-2xl">{item.productName}</h4>
                                        <div className="flex items-center gap-1">
                                            <Star size={14} fill="var(--brand-amber)" stroke="none" />
                                            <span className="font-mono text-sm text-[var(--brand-cream)]/60">{item.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-[var(--brand-cream)]/50 text-sm leading-relaxed">{item.productDescription}</p>
                                </div>
                            </DrawerBody>
                            <DrawerFooter className="border-t border-[var(--brand-border)] flex items-center justify-between px-5">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-heading text-[var(--brand-cream)] text-xl">₹{item.offerPrice}</span>
                                    {item.originalPrice > item.offerPrice && (
                                        <span className="font-mono text-sm text-[var(--brand-cream)]/30 line-through">₹{item.originalPrice}</span>
                                    )}
                                </div>
                                <QuantityControl />
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default ItemCards