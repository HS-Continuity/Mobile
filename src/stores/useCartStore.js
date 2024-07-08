import { create } from "zustand";

export const useCartStore = create(set => ({
  items: [],
  addItem: item => set(state => ({ items: [...state.items, item] })),
  removeItem: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
  updateQuantity: (id, quantity) =>
    set(state => ({
      items: state.items.map(item => (item.id === id ? { ...item, quantity } : item)),
    })),
}));
