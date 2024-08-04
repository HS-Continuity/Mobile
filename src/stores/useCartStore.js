// import { create } from "zustand";

// export const useCartStore = create(set => ({
//   items: [],
//   addItem: item => set(state => ({ items: [...state.items, item] })),
//   removeItem: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
//   updateQuantity: (id, quantity) =>
//     set(state => ({
//       items: state.items.map(item => (item.id === id ? { ...item, quantity } : item)),
//     })),
// }));

// const useCartStore = create((set, get) => ({
//   cartItems: [],
//   activeTab: 1,
//   checkedItems: {},
//   deliveryFees: {},

//   setCartItems: items => set({ cartItems: items }),
//   setActiveTab: tab => set({ activeTab: tab }),
//   setCheckedItems: items => set({ checkedItems: items }),
//   setDeliveryFees: fees => set({ deliveryFees: fees }),

//   toggleItemCheck: id =>
//     set(state => ({
//       checkedItems: { ...state.checkedItems, [id]: !state.checkedItems[id] },
//     })),

//   setAllChecked: checked =>
//     set(state => ({
//       checkedItems: state.cartItems.reduce((acc, item) => {
//         acc[item.cartProductId] = checked;
//         return acc;
//       }, {}),
//     })),

//   calculateCustomerTotal: items => {
//     const { checkedItems } = get();
//     return items.reduce((sum, item) => {
//       if (checkedItems[item.cartProductId]) {
//         return sum + item.productPrice * item.quantity;
//       }
//       return sum;
//     }, 0);
//   },

//   calculateTotalPrice: () => {
//     const { cartItems, activeTab, deliveryFees, calculateCustomerTotal } = get();
//     if (!cartItems || !deliveryFees) return 0;

//     let totalProductPrice = 0;
//     let totalDeliveryFee = 0;

//     const groupedItems = cartItems.reduce((acc, item) => {
//       if (!acc[item.customerId]) acc[item.customerId] = [];
//       acc[item.customerId].push(item);
//       return acc;
//     }, {});

//     Object.entries(groupedItems).forEach(([customerId, items]) => {
//       const customerTotal = calculateCustomerTotal(items);
//       totalProductPrice += customerTotal;

//       if (activeTab !== 2) {
//         const deliveryFee = deliveryFees[customerId] || 0;
//         totalDeliveryFee += deliveryFee;
//       }
//     });

//     return totalProductPrice + totalDeliveryFee;
//   },

//   getSelectedItems: () => {
//     const { cartItems, checkedItems } = get();
//     return cartItems.filter(item => checkedItems[item.cartProductId]);
//   },

//   getTotalProductPrice: () => {
//     const selectedItems = get().getSelectedItems();
//     return selectedItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
//   },

//   getTotalDeliveryFee: () => {
//     const { activeTab, deliveryFees, getSelectedItems } = get();
//     if (activeTab === 2) return 0; // 정기배송의 경우 배송비 0

//     const selectedItems = getSelectedItems();
//     const uniqueCustomerIds = [...new Set(selectedItems.map(item => item.customerId))];
//     return uniqueCustomerIds.reduce((sum, customerId) => sum + (deliveryFees[customerId] || 0), 0);
//   },
// }));
// export default useCartStore;
