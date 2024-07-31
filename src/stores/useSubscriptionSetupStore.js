import { create } from "zustand";

export const useSubscriptionSetupStore = create(set => ({
  subscriptionDetails: {
    deliveryDayOfWeeks: [],
    startDate: null,
    endDate: null,
    deliveryCycle: null,
  },
  setSubscriptionDetails: details =>
    set(state => ({
      subscriptionDetails: { ...state.subscriptionDetails, ...details },
    })),
}));
