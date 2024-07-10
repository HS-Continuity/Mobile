import { create } from "zustand";

export const useShopStore = create(set => ({
  selectedCategory: [],
  setSelectedCategory: category => set({ selectedCategory: category }),
}));
