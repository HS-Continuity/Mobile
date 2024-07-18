import { create } from "zustand";

// const useOrderStore = create(set => ({
//   orders: [],
//   setOrders: orders => set({ orders }),
// }));

const useOrderStore = create(set => ({
  // orderItems: [],
  // totalProductPrice: 0,
  // totalDeliveryFee: 0,
  // setOrderData: (items, productPrice, deliveryFee) =>
  //   set({
  //     orderItems: items,
  //     totalProductPrice: productPrice,
  //     totalDeliveryFee: deliveryFee,
  //   }),
  // clearOrderData: () =>
  //   set({
  //     orderItems: [],
  //     totalProductPrice: 0,
  //     totalDeliveryFee: 0,
  //   }),
}));

export default useOrderStore;
