  import { doc, getDoc, updateDoc} from 'firebase/firestore'
  import { Item } from '../types/ItemsTypes'
  import { getTempUserId } from '../utils/tempUserId'
  import { db } from '../config/firebaseConfig'

  // Extend Item type to include quantity for cart items
  export interface CartItem extends Item {
      quantity: number
  }

  // Add item to cart or increment quantity if exists
//   export const addToCart = async (item: Item) => {
//       const userId = getTempUserId() // Get temporary user ID from localStorage
//       const cartRef = doc(db, 'carts', userId)
//       const cartDoc = await getDoc(cartRef)

//       if (!cartDoc.exists()) {
//           // Create new cart if doesn't exist
//           await setDoc(cartRef, {
//               items: [{ ...item, quantity: 1 }]
//           })
//           console.log('Cart created');
          
//       } else {
//           const cart = cartDoc.data()
//           const existingItem = cart.items.find((i: CartItem) => i.id === item.id)

//           if (existingItem) {
//               // Update quantity if item exists
//               const updatedItems = cart.items.map((i: CartItem) =>
//                   i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//               )
//               await updateDoc(cartRef, { items: updatedItems })
//               console.log('Item quantity updated');
              
//           } else {
//               // Add new item to cart
//               await updateDoc(cartRef, {
//                   items: [...cart.items, { ...item, quantity: 1 }]
//               })
//           }
//       }
//   }

//   // Fetch current cart items
//   export const getCart = async () => {
//       const userId = getTempUserId()
//       const cartRef = doc(db, 'carts', userId)
//       const cartDoc = await getDoc(cartRef)
//       return cartDoc.exists() ? cartDoc.data().items : []
//   }

//   // Update quantity of specific item in cart
//   export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
//       const userId = getTempUserId()
//       const cartRef = doc(db, 'carts', userId)
//       const cartDoc = await getDoc(cartRef)
//       const cart = cartDoc.data()

//       // Update quantity and remove items with quantity 0
//       const updatedItems = cart.items.map((item: CartItem) =>
//           item.id === itemId ? { ...item, quantity } : item
//       ).filter((item: CartItem) => item.quantity > 0)

//       await updateDoc(cartRef, { items: updatedItems })
//   }

//   // Remove item from cart completely
//   export const removeFromCart = async (itemId: string) => {
//       const userId = getTempUserId()pp
//       const cartRef = doc(db, 'carts', userId)
//       const cartDoc = await getDoc(cartRef)
//       const cart = cartDoc.data()

//       const updatedItems = cart.items.filter((item: CartItem) => item.id !== itemId)

//       // Delete cart document if empty, otherwise update
//       if (updatedItems.length === 0) {
//           await deleteDoc(cartRef)
//       } else {
//           await updateDoc(cartRef, { items: updatedItems })
//       }
//   }

// Helper function to update cart items
const updateCartItems = async (userId: string, updateFn: (items: CartItem[]) => CartItem[]) => {
    const cartRef = doc(db, 'carts', userId)
    const cartDoc = await getDoc(cartRef)
    const cart = cartDoc.data()

    const updatedItems = updateFn(cart?.items)
    await updateDoc(cartRef, { items: updatedItems })
}

// Fetch current cart items
export const getCart = async () => {
    const userId = getTempUserId()
    const cartRef = doc(db, 'carts', userId)
    const cartDoc = await getDoc(cartRef)
    return cartDoc.exists() ? cartDoc.data().items : []
}

// Update quantity of specific item in cart
export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    const userId = getTempUserId()
    await updateCartItems(userId, (items) =>
        items.map((item: CartItem) =>
            item.id === itemId ? { ...item, quantity } : item
        ).filter((item: CartItem) => item.quantity > 0)
    )
}

// Remove item from cart completely
export const removeFromCart = async (itemId: string) => {
    const userId = getTempUserId()
    await updateCartItems(userId, (items) =>
        items.filter((item: CartItem) => item.id !== itemId)
    )
}