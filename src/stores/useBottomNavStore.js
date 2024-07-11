import { create } from "zustand";

export const useBottomNavStore = create(set => ({
  isBottomNavVisible: true,
  setBottomNavVisible: isVisible => set({ isBottomNavVisible: isVisible }),
}));
