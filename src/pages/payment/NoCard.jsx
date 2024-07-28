import { FaCreditCard } from "react-icons/fa";

const NoCard = ({ onAddCard }) => {
  return (
    <div className='flex flex-col items-center justify-center rounded-lg bg-white p-8'>
      <FaCreditCard className='mb-4 text-6xl text-gray-300' />
      <h2 className='mb-2 text-2xl font-semibold text-gray-700'>등록된 카드가 없습니다</h2>
      <p className='mb-4 text-center text-gray-500'>카드를 등록하여 편리하게 사용해보세요.</p>
    </div>
  );
};

export default NoCard;
