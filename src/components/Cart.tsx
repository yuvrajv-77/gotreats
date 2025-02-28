import { useCartStore } from '../store/cartStore'

export const Cart = () => {
  const { items, updateQuantity, removeItem } = useCartStore()

  console.log("items in cart ", items);
  

  return (
  <div>
    
  </div>
  )
}
