import React from "react";

const MemberCouponList = ({ coupons, selectedCoupon, handleCouponChange }) => {
  return (
    <div className='rounded-lg border bg-white p-4'>
      <h2 className='mb-2 text-xl font-semibold'>쿠폰</h2>
      <hr className='mb-3 border-gray-200' />
      <div className='space-y-2'>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>쿠폰 선택</span>
          <select
            className='ml-2 rounded border border-gray-300 px-2 py-1'
            onChange={handleCouponChange}
            value={selectedCoupon ? selectedCoupon.memberCouponId : ""}>
            <option value=''>쿠폰을 선택하세요</option>
            {coupons && coupons.length > 0 ? (
              coupons.map(coupon => (
                <option key={coupon.memberCouponId} value={coupon.memberCouponId}>
                  {coupon.couponName} ({coupon.discountAmount.toLocaleString()}원 할인)
                </option>
              ))
            ) : (
              <option disabled>사용 가능한 쿠폰이 없습니다</option>
            )}
          </select>
        </div>
        {selectedCoupon && (
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>선택된 쿠폰</span>
            <span className='ml-2 text-green-600'>
              {selectedCoupon.couponName} ({selectedCoupon.discountAmount.toLocaleString()}원 할인)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCouponList;
