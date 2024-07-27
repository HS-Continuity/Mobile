import { FaMapMarkerAlt } from "react-icons/fa";

const NoAddress = ({ onAddAddress }) => {
  return (
    <div className='flex flex-col items-center justify-center rounded-lg bg-white p-8'>
      <FaMapMarkerAlt className='mb-4 text-6xl text-gray-300' />
      <h2 className='mb-2 text-2xl font-semibold text-gray-700'>등록된 배송지가 없습니다</h2>
      <p className='mb-4 text-center text-gray-500'>새로운 배송지를 등록해 주세요.</p>
    </div>
  );
};

export default NoAddress;
