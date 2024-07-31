function getStatusText(status) {
  const statusMap = {
    PENDING: "주문 대기",
    PAYMENT_COMPLETED: "결제 완료",
    AWAITING_RELEASE: "출고 대기",
    PREPARING_PRODUCT: "상품 준비중",
    SHIPPED: "배송중",
    IN_DELIVERY: "배송중",
    DELIVERED: "배송 완료",
    CANCELED: "주문 취소",
  };
  return statusMap[status] || status;
}

export default getStatusText;
