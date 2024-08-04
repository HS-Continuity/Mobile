function getStatusStyle(status) {
  const styleMap = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
    PAYMENT_COMPLETED: { bg: "bg-green-100", text: "text-green-800" },
    AWAITING_RELEASE: { bg: "bg-blue-100", text: "text-blue-800" },
    PREPARING_PRODUCT: { bg: "bg-indigo-100", text: "text-indigo-800" },
    SHIPPED: { bg: "bg-purple-100", text: "text-purple-800" },
    IN_DELIVERY: { bg: "bg-purple-100", text: "text-purple-800" },
    DELIVERED: { bg: "bg-gray-100", text: "text-gray-800" },
    CANCELED: { bg: "bg-red-100", text: "text-red-800" },
  };
  return styleMap[status] || { bg: "bg-gray-100", text: "text-gray-800" };
}

export default getStatusStyle;
