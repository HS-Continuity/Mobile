import { FaTicketAlt } from "react-icons/fa";

const NoCoupon = () => {
  return (
    <div className='flex h-64 flex-col items-center justify-center'>
      <FaTicketAlt className='mb-4 text-6xl text-gray-300' />
      <h2 className='mb-2 text-2xl font-semibold text-gray-600'>쿠폰이 없습니다</h2>
      <p className='text-gray-500'>현재 사용 가능한 쿠폰이 없습니다.</p>
    </div>
  );
};

export default NoCoupon;
