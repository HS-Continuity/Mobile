import { create } from "zustand";

export const useSubscriptionSetupStore = create(set => ({
  subscriptionDetails: {
    frequency: "",
    duration: "",
    selectedDays: [],
  },
  setSubscriptionDetails: details => set({ subscriptionDetails: details }),
}));
