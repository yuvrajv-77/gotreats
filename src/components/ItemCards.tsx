import { Star, Triangle } from 'lucide-react'
import { Item } from '../types/ItemsTypes'

import { CartItem } from '../services/cartService'
import { useCartStore } from '../store/cartStore'

const ItemCards = ({ item }: { item: Item }) => {

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
            updateQuantity(item.id, quantity - 1)
        }
    }

    return (
        <>
            <div className=' md:flex flex-col hidden group w-64 lg:w-76 bg-white p-6 rounded-3xl shadow-xs cursor-pointer hover:bg-green-50 transition-color duration-500  border-orange-50'>
                <img src={item.image} alt="" className='mb-5 size-64 object-cover rounded-3xl group-hover:scale-102 transition-all duration-500' />
                {item.veg ? veg : nonVeg}
                <h4 className='lancelot text-2xl lg:text-3xl font-medium'>{item.name}</h4>
                <p className='comfortaa text-sm text-green-700 font-bold flex items-center gap-1 mb-2'><Star fill='green' size={13} />{item.rating}</p>

                <p className='text-gray-500 text-sm lg:text:base leading-5 line-clamp-2'>{item.description}</p>
                <div className='flex justify-between items-center mt-5'>
                    <div className=' h-9 flex justify-between items-center bg-green-100 rounded-lg text-lg'>
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
                    <div className='inline-flex items-center gap-2'>
                        <p className='comfortaa text-lg line-through '> ₹{item.price} </p>
                        <span className='px-[3px] py-[1px] flex items-center text-lg shadow-3xl bg-yellow-500'>₹{item.offerPrice}</span>
                    </div>
                </div>
            </div>

            <div className='flex md:hidden  justify-between  mx-2 p-4 gap-1 rounded-xl shadow-xs cursor-pointer bg-white transition-color duration-500 w-full'>
                <div className=' w-3/5'>
                    {item.veg ? veg : nonVeg}
                    <h4 className='lancelot text-2xl font-bold mb-2'>{item.name}</h4>
                    <div className='inline-flex items-center gap-2 mb-2'>
                        <p className='comfortaa text-lg line-through '> ₹{item.price} </p>
                        <span className='px-[3px] py-[1px] flex items-center text-lg shadow-3xl bg-yellow-500'>₹{item.offerPrice}</span>
                    </div>
                    <p className='comfortaa text-sm text-green-700 font-bold flex items-center gap-1 mb-3'><Star fill='green' size={13} />{item.rating}</p>
                    <p className=' text-gray-500 text-sm line-clamp-2 tracking-tight'>{item.description}</p>
                </div>
                <div className='flex flex-col justify-between items-center  w-2/5'>
                    <img src={item.image} className='w-full mb-3  rounded-2xl  object-contain' alt="" />
                    <div className=' h-9 flex justify-between items-center bg-green-100 rounded-lg text-lg'>
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
                </div>
            </div>
        </>
    )
}

export default ItemCards