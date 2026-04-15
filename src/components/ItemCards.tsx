import { Star, Triangle, X } from 'lucide-react'
import { Item } from '../types/ItemsTypes'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Skeleton, Image } from '@heroui/react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

const ItemCards = ({ item }: { item: Item }) => {
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
        <div className='relative '>
            <div className='md:flex flex-col justify-between hidden group lg:w-77 bg-white p-5 rounded-3xl shadow-xs cursor-pointer hover:bg-green-50 transition-color duration-500 border-orange-50 relative' >
                
                <div className="relative mb-5 ">
                   
                    {!imgLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-3xl" >
                            <p className='font-bowlby text-4xl tracking-wide font-bold text-zinc-400'>bitebox</p>
                        </div>
                    )}
                    {/* <img
                        src={item.imageUrl}
                        alt=""
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`size-64 object-cover rounded-3xl group-hover:scale-102 transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    /> */}
                    <Image src={item.imageUrl} alt=""  loading='lazy' disableSkeleton onLoad={() => setImgLoaded(true)} className={`w-full h-70 object-cover rounded-3xl group-hover:scale-102 group-hover:shadow-lg transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                {item.isNonVeg ? nonVeg : veg}
                <h4 className='font-bowlby uppercase text-xl font-medium'>{item.productName}</h4>
                <p className='comfortaa text-sm text-green-700 font-bold flex items-center gap-1 mb-2'><Star fill='green' size={13} />{item.rating}</p>

                <p className='text-gray-500 text-lg lg:text:base leading-5 line-clamp-2 font-mouse'>{item.productDescription}</p>
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
                    <div className='inline-flex items-center gap-2 font-bowlby'>
                        <p className=' text-lg line-through '> ₹{item.originalPrice} </p>
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
                    <h4 className='font-bowlby  text- mb-2'>{item.productName}</h4>
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
                                <p className='comfortaa text-2xl tracking-wider font-bold text-zinc-400'>Bitebox</p>
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

            <Drawer isOpen={isOpen} placement='bottom'  size='lg' hideCloseButton onOpenChange={onOpenChange}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                        {/* <DrawerHeader><span className='absolute -top-1 right-3 bg-gray-800 text-white rounded-full p-3'><X onClick={onClose} /></span></DrawerHeader> */}
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
        </div>
    )
}

export default ItemCards