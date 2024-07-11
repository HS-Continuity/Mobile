const MemberCouponList = ({ coupons, selectedCoupon, handleCouponChange }) => {
  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <h2 className='mb-2 font-bold'>쿠폰</h2>
      <select
        className='select select-bordered w-full'
        onChange={handleCouponChange}
        value={selectedCoupon ? selectedCoupon.id : ""}>
        <option value=''>쿠폰을 선택하세요</option>
        {coupons && coupons.length > 0 ? (
          coupons.map(coupon => (
            <option key={coupon.id} value={coupon.id}>
              {coupon.coupon_name} ({coupon.discount_amount.toLocaleString()}원 할인)
            </option>
          ))
        ) : (
          <option disabled>사용 가능한 쿠폰이 없습니다</option>
        )}
      </select>
    </div>
  );
};

export default MemberCouponList;
