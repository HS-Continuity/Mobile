import { create } from "zustand";

const useCouponsStore = create(set => ({
  coupons: [],
  setCoupons: coupons => set({ coupons }),
}));

export default useCouponsStore;
