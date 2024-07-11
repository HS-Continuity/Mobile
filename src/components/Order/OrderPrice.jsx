const OrderPrice = ({ totalPrice, shippingFee, selectedCoupon, finalPrice }) => {
  const couponDiscount = selectedCoupon ? selectedCoupon.discount_amount : 0;

  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <h2 className='mb-2 font-bold'>결제 금액</h2>
      <div className='flex justify-between'>
        <span>총 상품 금액</span>
        <span>{totalPrice.toLocaleString()}원</span>
      </div>
      <div className='flex justify-between'>
        <span>배송비</span>
        <span>{shippingFee.toLocaleString()}원</span>
      </div>
      {selectedCoupon && (
        <div className='flex justify-between text-red-500'>
          <span>쿠폰 할인</span>
          <span>-{couponDiscount.toLocaleString()}원</span>
        </div>
      )}
      <div className='mt-2 flex justify-between font-bold'>
        <span>총 결제금액</span>
        <span>{finalPrice.toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default OrderPrice;
