import { FaRegClock } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";

const PriceBox = ({ originalPrice, discountRate, finalPrice, isRegular }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300`}>
      <div className='flex-grow'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-gray-500 line-through'>
            {originalPrice.toLocaleString()}원
          </span>
          <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600'>
            {discountRate}% 할인
          </span>
        </div>
        <div className='mt-1 text-xl font-bold text-gray-800'>{finalPrice.toLocaleString()}원</div>
      </div>
      <div className='flex flex-col items-end'>
        {isRegular ? (
          <div className='flex items-center text-sm font-semibold text-[#00835F]'>
            <FaRegClock className='mr-1' />
            정기배송 할인가
          </div>
        ) : (
          <div className='flex items-center text-sm font-semibold text-yellow-600'>
            <BsLightningCharge className='mr-1' />
            단건 구매가
          </div>
        )}
        <div className='mt-1 text-xs text-gray-500'>
          {(originalPrice - finalPrice).toLocaleString()}원 절약
        </div>
      </div>
    </div>
  );
};

export default PriceBox;
