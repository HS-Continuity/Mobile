import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CardRegisterModal = ({ isOpen, onClose, onSubmit }) => {
  const [cardData, setCardData] = useState({
    card_number: "",
    card_company: "",
    card_expiration_year: "",
    card_expiration_month: "",
    card_password: "",
    master_birthday: "",
    card_cvc: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formattedData = {
      ...cardData,
      card_expiration: `${cardData.card_expiration_year}/${cardData.card_expiration_month.padStart(2, "0")}`,
    };
    onSubmit(formattedData);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed -inset-5 z-30 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-96 rounded-lg bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>카드 등록</h2>
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>카드 번호</label>
            <input
              type='text'
              name='card_number'
              value={cardData.card_number}
              onChange={handleChange}
              placeholder='1234-1234-1234-1234'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>카드사</label>
            <select
              name='card_company'
              value={cardData.card_company}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required>
              <option value=''>선택하세요</option>
              <option value='국민카드'>국민카드</option>
              <option value='신한카드'>신한카드</option>
              <option value='하나카드'>하나카드</option>
              <option value='우리카드'>우리카드</option>
              <option value='농협카드'>농협카드</option>
              <option value='기업카드'>기업카드</option>
              <option value='카카오뱅크'>카카오뱅크</option>
              <option value='케이뱅크'>케이뱅크</option>
              <option value='토스뱅크'>토스뱅크</option>
            </select>
          </div>
          <div className='mb-4 flex space-x-4'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>유효 년도</label>
              <input
                type='text'
                name='card_expiration_year'
                value={cardData.card_expiration_year}
                onChange={handleChange}
                placeholder='YYYY'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                required
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>유효 월</label>
              <input
                type='text'
                name='card_expiration_month'
                value={cardData.card_expiration_month}
                onChange={handleChange}
                placeholder='MM'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                required
              />
            </div>
          </div>
          <div className='mb-4 flex space-x-4'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                카드 비밀번호 앞 두자리
              </label>
              <input
                type='password'
                name='card_password'
                value={cardData.card_password}
                onChange={handleChange}
                placeholder='**'
                maxLength='2'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                required
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>CVC</label>
              <input
                type='password'
                name='card_cvc'
                value={cardData.card_cvc}
                onChange={handleChange}
                placeholder='***'
                maxLength='3'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                required
              />
            </div>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>생년월일</label>
            <input
              type='text'
              name='master_birthday'
              value={cardData.master_birthday}
              onChange={handleChange}
              placeholder='970304'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
            카드 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardRegisterModal;
