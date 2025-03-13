import { create } from 'zustand'

import { Item } from '../types/ItemsTypes'

interface ProductStore {
  products: Item[]
  setProducts: (products: Item[]) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}))
