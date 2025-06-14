import { create } from 'zustand';

interface OrderPlacedModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useOrderPlacedModalStore = create<OrderPlacedModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));