import React from "react";

const PriceBox = ({ originalPrice, discountRate, finalPrice, isRegular }) => {
  return (
    <>
      <div
        className={`flex items-center justify-between rounded-lg border p-2 ${isRegular ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
        <div>
          <span className='text-sm text-gray-500 line-through'>
            {originalPrice.toLocaleString()}원
          </span>
          <div className='font-bold'>
            <span className='text-red-500'>{discountRate}%</span> {finalPrice.toLocaleString()}원
          </div>
        </div>
        {isRegular && <div className='text-sm font-semibold text-blue-500'>정기배송 할인가</div>}
      </div>
    </>
  );
};

export default PriceBox;
