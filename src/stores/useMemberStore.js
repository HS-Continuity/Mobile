import { create } from "zustand";

const useUserStore = create(set => ({
  user: null,
  setUser: user => set({ user }),
  updateUser: updatedFields =>
    set(state => ({
      user: { ...state.user, ...updatedFields },
    })),
}));

export default useUserStore;
