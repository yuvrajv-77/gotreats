import { Star, Triangle } from 'lucide-react'
import { Item } from '../types/ItemsTypes'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Skeleton } from '@heroui/react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

// Add keyframes for the glowing animation
const glowingStyles = `
    @keyframes glowingText {
        0% {
            background-position: -200% center;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
        }
        100% {
            background-position: 200% center;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
    }

    .glowing-text {
        background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffd700 25%,
            #ffffff 50%,
            #ffd700 75%,
            #ffffff 100%
        );
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: glowingText 2s linear infinite;
        font-weight: 600;
        letter-spacing: 0.5px;
        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
    }

    .tag-container {
        position: relative;
    }

    .tag-container::before {
        content: '';
        position: absolute;
        inset: -1px;
        background: linear-gradient(90deg, #ff8c00, #ffd700);
        border-radius: inherit;
        padding: 1px;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0.7;
        animation: borderGlow 2s linear infinite;
    }

    @keyframes borderGlow {
        0%, 100% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
    }
`;

const ItemCards = ({ item }: { item: Item }) => {
    // Add styles to the document head
    React.useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = glowingStyles;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgLoadedMobile, setImgLoadedMobile] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const veg = (
        <div className='border-2 rounded-md border-green-700 flex items-center justify-center size-5 mb-1'>
            <div className='p-1 bg-green-700 rounded-full size-2'></div>
        </div>
    )
    const nonVeg = (
        <div className='border-2 rounded-md border-red-900 flex items-center justify-center size-5 mb-1'>
            <Triangle size={10} color='brown' fill='brown' />
        </div>
    )

    const { items, addItem, updateQuantity } = useCartStore()
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Get quantity of this item from cart
    const cartItem = items.find(i => i.id === item.id)
    const quantity = cartItem?.quantity || 0

    const handleIncrement = () => {
        if (quantity === 0) {
            addItem(item)
        } else {
            updateQuantity(item.id, quantity + 1)
        }
    }

    const handleDecrement = () => {
        if (quantity > 0) {
            updateQuantity(item?.id, quantity - 1)
        }
    }

    return (
        <>
            <div className='md:flex flex-col justify-between hidden group w-64 lg:w-76 bg-white p-6 rounded-3xl shadow-xs cursor-pointer hover:bg-green-50 transition-color duration-500 border-orange-50 relative' >
                {/* Most Ordered Tag for Desktop */}
                {(item.productName.toLowerCase().includes('combo') ||
                    item.productName.toLowerCase().includes('poori bhaji')) && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-2 -right-2 z-10"
                        >
                            <div className="tag-container bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-lg shadow-lg transform rotate-3 whitespace-nowrap">
                                <span className="glowing-text">Most Ordered</span> ⭐
                            </div>
                        </motion.div>
                    )}
                <div className="relative mb-5 size-64">
                    {/* {!imgLoaded && (
                        <Skeleton className='absolute inset-0  flex items-center justify-center rounded-3xl'>
                            <p className='comfortaa text-4xl tracking-tighter z-10 font-bold text-zinc-400'>gotreats</p>
                        </Skeleton>
                    )} */}
                    {!imgLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-3xl" >
                            <p className='comfortaa text-4xl tracking-tighter font-bold text-zinc-400'>gotreats</p>
                        </div>
                    )}
                    <img
                        src={item.imageUrl}
                        alt=""
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`size-64 object-cover rounded-3xl group-hover:scale-102 transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>
                {item.isNonVeg ? nonVeg : veg}
                <h4 className='lancelot text-2xl lg:text-3xl font-medium'>{item.productName}</h4>
                <p className='comfortaa text-sm text-green-700 font-bold flex items-center gap-1 mb-2'><Star fill='green' size={13} />{item.rating}</p>

                <p className='text-gray-500 text-sm lg:text:base leading-5 line-clamp-2'>{item.productDescription}</p>
                <div className='flex justify-between items-center mt-5'>
                    {
                        user ?
                            <div className='  h-9 flex justify-between items-center bg-green-100 rounded-lg text-lg' onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={handleDecrement}
                                    className='h-full flex items-center px-3 text-4xl text-green-600 cursor-pointer'
                                >
                                    -
                                </button>
                                <p className='px-2 text-green-600 font-semibold'>{quantity}</p>
                                <button
                                    onClick={handleIncrement}
                                    className='h-full flex items-center px-3 text-3xl text-green-600 cursor-pointer hover:text-green-800'
                                >
                                    +
                                </button>
                            </div>
                            :
                            <button onClick={() => navigate('/register')} className=' h-9 flex justify-between items-center bg-green-100 rounded-lg text-lg'>
                                <p className='px-2 text-green-600 text-sm font-semibold'>Login to add</p>
                            </button>
                    }
                    <div className='inline-flex items-center gap-2'>
                        <p className='comfortaa text-lg line-through '> ₹{item.originalPrice} </p>
                        <span className='px-[3px] py-[1px] flex items-center text-lg shadow-3xl bg-yellow-500 '>₹{item.offerPrice}</span>
                    </div>
                </div>
            </div>

            <div className='flex md:hidden justify-between mx-2 p-4 gap-1 rounded-xl shadow-xs cursor-pointer bg-white transition-color duration-500 w-full relative' >
                {/* Most Ordered Tag for Mobile */}
                {(item.productName.toLowerCase().includes('combo') ||
                    item.productName.toLowerCase().includes('poori bhaji')) && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-2 right-2 z-10"
                        >
                            <div className="tag-container bg-gradient-to-r from-orange-600 to-orange-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md shadow-md transform rotate-2 whitespace-nowrap">
                                <span className="glowing-text">Most Ordered</span> ⭐
                            </div>
                        </motion.div>
                    )}
                <div className=' w-3/5'>
                    {item.isNonVeg ? nonVeg : veg}
                    <h4 className='lancelot text-2xl font-bold mb-2'>{item.productName}</h4>
                    <div className='inline-flex items-center gap-2 mb-2'>
                        <p className='comfortaa text-lg line-through '> ₹{item.originalPrice} </p>
                        <span className='px-[3px] py-[1px] flex items-center text-lg shadow-3xl bg-yellow-500 '>₹{item.offerPrice}</span>
                    </div>
                    <p className='comfortaa text-sm text-green-700 font-bold flex items-center gap-1 mb-3'><Star fill='green' size={13} />{item.rating}</p>
                    <p className=' text-gray-500 text-sm line-clamp-2 tracking-tight'>{item.productDescription}</p>
                </div>
                <div className='flex flex-col justify-between items-end  w-2/5'>
                    <div className="relative size-30 mb-3" onClick={onOpen}>
                        {!imgLoadedMobile && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-3xl" >
                                <p className='comfortaa text-2xl tracking-tighter font-bold text-zinc-400'>gotreats</p>
                            </div>
                        )}
                        <img
                            src={item.imageUrl}
                            alt=""
                            loading="lazy"
                            onLoad={() => setImgLoadedMobile(true)}
                            className={`size-30 rounded-2xl object-cover transition-all duration-500 ${imgLoadedMobile ? 'opacity-100' : 'opacity-0'}`}
                        />
                    </div>
                    {
                        user ?
                            <div className=' h-9 flex justify-between mr-2 items-center bg-green-100 rounded-lg text-lg'>
                                <button
                                    onClick={handleDecrement}
                                    className='h-full flex items-center px-3 text-4xl text-green-600 cursor-pointer'
                                >
                                    -
                                </button>
                                <p className='px-2 text-green-600 font-semibold'>{quantity}</p>
                                <button
                                    onClick={handleIncrement}
                                    className='h-full flex items-center px-3 text-3xl text-green-600 cursor-pointer hover:text-green-800'
                                >
                                    +
                                </button>
                            </div>
                            :
                            <button onClick={() => navigate('/register')} className=' h-9 flex justify-between items-center bg-green-100 rounded-lg text-lg'>
                                <p className='px-2 text-green-600 text-sm font-semibold'>Login to add</p>
                            </button>
                    }
                </div>
            </div>

            <Drawer isOpen={isOpen} placement='bottom' size='lg' hideCloseButton onOpenChange={onOpenChange}>
                <DrawerContent className=''>
                    {(onClose) => (
                        <>
                            <DrawerBody className='pt-5'>
                                <div className=' rounded-lg w-full h-[1200px] overflow-hidden'>
                                    <img className='w-full h-full  object-cover' src={item.imageUrl} alt="" />
                                </div>

                                <div className='mt-4 mb-2 space-y-2'>
                                    {item.isNonVeg ? nonVeg : veg}
                                    <div className='flex items-center justify-between '>
                                        <h4 className='lancelot text-xl lg:text-3xl font-bold'>{item.productName}</h4>
                                        <p className='comfortaa text-sm text-green-700 font-bold flex items-center gap-1 mb-2'><Star fill='green' size={13} />{item.rating}</p>
                                    </div>
                                    <p className='text-gray-500 text-sm lg:text:base leading-5 line-clamp-2'>{item.productDescription}</p>
                                </div>

                            </DrawerBody>
                            <DrawerFooter className='flex justify-between items-center'>
                                <div className='inline-flex items-center gap-2 mb-2'>
                                    <p className='comfortaa text-lg line-through '> ₹{item.originalPrice} </p>
                                    <span className='px-[3px] py-[1px] flex items-center text-lg shadow-3xl bg-yellow-500 '>₹{item.offerPrice}</span>
                                </div>
                                {
                                    user ?
                                        <div className='outline outline-green-500 h-10 flex justify-between gap-2 mr-2 items-center bg-green-100 rounded-lg text-lg'>
                                            <button
                                                onClick={handleDecrement}
                                                className='h-full flex items-center px-3 text-4xl text-green-600 cursor-pointer'
                                            >
                                                -
                                            </button>
                                            <p className='px-2 text-green-600 font-semibold'>{quantity}</p>
                                            <button
                                                onClick={handleIncrement}
                                                className='h-full flex items-center px-3 text-3xl text-green-600 cursor-pointer hover:text-green-800'
                                            >
                                                +
                                            </button>
                                        </div>
                                        :
                                        <button onClick={() => navigate('/register')} className=' h-9 flex justify-between items-center bg-green-100 rounded-lg text-lg'>
                                            <p className='px-2 text-green-600 text-sm font-semibold'>Login to add</p>
                                        </button>
                                }
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default ItemCards