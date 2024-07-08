import { create } from "zustand";

export const useProductStore = create(set => ({
  products: [],
  setProducts: products => set({ products }),
  addProducts: newProducts => set(state => ({ products: [...state.products, ...newProducts] })),
}));
