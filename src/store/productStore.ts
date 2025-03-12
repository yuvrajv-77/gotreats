import { create } from 'zustand'
import { Product } from '../types/product'

interface ProductStore {
  products: Product[]
  setProducts: (products: Product[]) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}))
