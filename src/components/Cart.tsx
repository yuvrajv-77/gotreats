import { useCartStore } from '../store/cartStore'
import { Item } from '../types/ItemsTypes'
import Button from './Button'

export const Cart = () => {
  const { items, addItem, updateQuantity } = useCartStore()



  const handleIncrement = (item: Item) => {
    const quantity = items.find(i => i.id === item.id)?.quantity || 0
    if (quantity === 0) {
      addItem(item)
    } else {
      updateQuantity(item.id, quantity + 1)
    }
  }
  const handleDecrement = (item: any) => {
    const quantity = items.find(i => i.id === item.id)?.quantity || 0
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1)
    }
  }

  console.log("items in cart ", items);

  if (items.length === 0) {
    return
  }

  return (
    <div className=' md:p-6 bg-white '>



      {/* cart item container */}
      <div className='flex flex-col gap-2'>
        {items.map((item) => (
          <div className='flex  justify-between md:justify-between md:px-20 items-center w-full rounded-xl  cursor-pointer bg-white transition-color duration-500 '>

            <div>
              <h4 className='lancelot md:text-xl'>{item.productName}</h4>
              <span className='px-[3px] py-[1px] flex items-center  '>
                ${item.offerPrice}
              </span>
            </div>

            <span className='h-8 flex  justify-start items-center bg-green-100 rounded-lg text-lg '>
              <button onClick={() => handleDecrement(item)}
                className='h-full flex items-center px-3 text-4xl text-green-600 cursor-pointer'>
                -
              </button>
              <p className='px-2 text-green-600 font-semibold'>{item.quantity}</p>
              <button onClick={() => handleIncrement(item)}
                className='h-full flex items-center px-3 text-3xl text-green-600 cursor-pointer hover:text-green-800'>
                +
              </button>
            </span>



          </div>
        ))}
      </div>



    </div>
  )
}
