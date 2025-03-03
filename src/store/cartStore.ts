import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Item } from '../types/ItemsTypes'

interface CartItem extends Item {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  grossTotalPrice: number
  totalPrice: number
  addItem: (item: Item) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  calculateGrossTotalPrice: () => void
  calculateTotalPrice: (deliveryCharge: number, taxRate: number) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      grossTotalPrice: 0,
      totalPrice: 0,
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id)
        const newItems = existingItem
          ? state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [...state.items, { ...item, quantity: 1 }]
        return { items: newItems }
      }),
      removeItem: (itemId) => set((state) => {
        const newItems = state.items.filter((item) => item.id !== itemId)
        return { items: newItems }
      }),
      updateQuantity: (itemId, quantity) => set((state) => {
        const newItems = state.items.map((item) =>
          item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter((item) => item.quantity > 0)
        return { items: newItems }
      }),
      clearCart: () => {
        return { items: [] }
      },
      calculateGrossTotalPrice: () => set((state) => ({
        grossTotalPrice: state.items.reduce((total, item) => total + item.offerPrice * item.quantity, 0),
      })),
      calculateTotalPrice: (deliveryCharge, taxRate) => set((state) => ({
        totalPrice: state.grossTotalPrice + deliveryCharge + (state.grossTotalPrice * taxRate),
      })),
    }),
    {
      name: 'cart-storage', // unique name
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
)