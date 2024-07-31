import React from "react";

const OrderPrice = ({
  regularShippingDiscount,
  totalProductPrice,
  totalDeliveryFee,
  selectedCoupon,
  finalPrice,
}) => {
  const couponDiscount = selectedCoupon ? selectedCoupon.discountAmount : 0;

  return (
    <div className='rounded-lg border bg-white p-4'>
      <h2 className='mb-4 text-xl font-semibold'>결제 정보</h2>
      <div className='space-y-2'>
        <div className='flex justify-between'>
          <span>상품 금액</span>
          <span>{totalProductPrice.toLocaleString()}원</span>
        </div>
        <div className='flex justify-between'>
          <span>{regularShippingDiscount ? "정기 배송비" : "배송비"}</span>
          <span>{totalDeliveryFee.toLocaleString()}원</span>
        </div>
        {selectedCoupon && (
          <div className='flex justify-between'>
            <span>할인 금액</span>
            <span className='text-red-500'>- {couponDiscount.toLocaleString()}원</span>
          </div>
        )}
        <div className='flex justify-between border-t pt-2 font-bold'>
          <span>총 결제 금액</span>
          <span>{finalPrice.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default OrderPrice;
