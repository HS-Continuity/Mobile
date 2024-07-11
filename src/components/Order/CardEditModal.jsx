import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const CardEditModal = ({ isOpen, onClose, onSubmit, cardData }) => {
  const [editedCard, setEditedCard] = useState({
    id: "",
    member_id: "",
    card_number: "",
    card_company: "",
    card_expiration: "",
    card_cvc: "",
    card_password: "",
    master_birthday: "",
  });

  useEffect(() => {
    if (cardData) {
      setEditedCard({
        id: cardData.id || "",
        member_id: cardData.member_id || "",
        master_birthday: cardData.master_birthday || "",
        card_password: cardData.card_password || "",
        card_number: cardData.card_number || "",
        card_company: cardData.card_company || "",
        card_expiration: cardData.card_expiration || "",
        card_cvc: cardData.card_cvc || "",
      });
    }
  }, [cardData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedCard(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(editedCard);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-96 rounded-lg bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>카드 정보 수정</h2>
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
              value={editedCard.card_number}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>카드사</label>
            <select
              name='card_company'
              value={editedCard.card_company}
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
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>유효기간</label>
            <input
              type='text'
              name='card_expiration'
              value={editedCard.card_expiration}
              onChange={handleChange}
              placeholder='YYYY/MM'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>CVC</label>
            <input
              type='text'
              name='card_cvc'
              value={editedCard.card_cvc}
              onChange={handleChange}
              maxLength='3'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
            수정 완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardEditModal;
