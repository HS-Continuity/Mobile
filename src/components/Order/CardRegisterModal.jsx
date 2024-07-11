import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const CardRegisterModal = ({ isOpen, onClose, onSubmit }) => {
  const [isValid, setIsValid] = useState(false);
  const [cardData, setCardData] = useState({
    card_number_1: "",
    card_number_2: "",
    card_number_3: "",
    card_number_4: "",
    card_number: "",
    card_company: "",
    card_expiration_year: "",
    card_expiration_month: "",
    card_password: "",
    master_birthday: "",
    card_cvc: "",
  });

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const isCardNumberValid =
      cardData.card_number_1.length === 4 &&
      cardData.card_number_2.length === 4 &&
      cardData.card_number_3.length === 4 &&
      cardData.card_number_4.length === 4 &&
      /^\d+$/.test(
        cardData.card_number_1 +
          cardData.card_number_2 +
          cardData.card_number_3 +
          cardData.card_number_4
      );

    const isCardCompanySelected = cardData.card_company !== "";

    const isExpirationValid =
      cardData.card_expiration_year !== "" &&
      cardData.card_expiration_month !== "" &&
      (parseInt(cardData.card_expiration_year, 10) > currentYear ||
        (parseInt(cardData.card_expiration_year, 10) === currentYear &&
          parseInt(cardData.card_expiration_month, 10) >= currentMonth));

    const isPasswordValid = /^\d{2}$/.test(cardData.card_password);
    const isCvcValid = /^\d{3}$/.test(cardData.card_cvc);
    const isBirthdayValid = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/.test(
      cardData.master_birthday
    );

    setIsValid(
      isCardNumberValid &&
        isCardCompanySelected &&
        isExpirationValid &&
        isPasswordValid &&
        isCvcValid &&
        isBirthdayValid
    );
  }, [cardData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e, next) => {
    const { name, value } = e.target;
    if (value.length === 4 && next) {
      document.getElementById(next).focus();
    }
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formattedData = {
      card_number: `${cardData.card_number_1}-${cardData.card_number_2}-${cardData.card_number_3}-${cardData.card_number_4}`,
      card_company: cardData.card_company,
      card_expiration: `${cardData.card_expiration_year}/${cardData.card_expiration_month.padStart(2, "0")}`,
      card_password: cardData.card_password,
      master_birthday: cardData.master_birthday,
      card_cvc: cardData.card_cvc,
      is_simple_payment_agreed: 0,
    };
    onSubmit(formattedData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  const validateBirthday = value => {
    // YYMMDD 형식의 정규표현식
    const regex = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
    return regex.test(value);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50'>
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
            <div className='flex space-x-2'>
              {["card_number_1", "card_number_2", "card_number_3", "card_number_4"].map(
                (name, index) => (
                  <input
                    key={name}
                    type='tel'
                    id={name}
                    name={name}
                    value={cardData[name]}
                    onChange={e =>
                      handleCardNumberChange(e, index < 3 ? `card_number_${index + 2}` : null)
                    }
                    maxLength='4'
                    className='mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                    required
                  />
                )
              )}
            </div>
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
              <select
                name='card_expiration_year'
                value={cardData.card_expiration_year}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                required>
                <option value=''>선택</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>유효 월</label>
              <select
                name='card_expiration_month'
                value={cardData.card_expiration_month}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                required>
                <option value=''>선택</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
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
              maxLength='6'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
              pattern='\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])'
              title='YYMMDD 형식으로 입력해주세요. (예: 970304)'
            />
          </div>
          <button
            type='submit'
            className={`w-full rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isValid ? "bg-blue-500 hover:bg-blue-600" : "cursor-not-allowed bg-gray-400"
            }`}
            disabled={!isValid}>
            카드 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardRegisterModal;
