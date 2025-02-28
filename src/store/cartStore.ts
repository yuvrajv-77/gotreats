import { create } from 'zustand'
import { Item } from '../types/ItemsTypes'

interface CartItem extends Item {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Item) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id)
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    }
    return { items: [...state.items, { ...item, quantity: 1 }] }
  }),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0),
    })),
  clearCart: () => set({ items: [] }),


  
}))


