import { useState, useEffect, useRef } from "react";
import VirtualKeypad from "./VirtualKeypad";
import Modal from "../../pages/product/Modal";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/useAuthStore";

const CardRegisterModal = ({ isOpen, onClose, onSubmit }) => {
  // const memberId = import.meta.env.VITE_MEMBER_ID;
  const { username } = useAuthStore();
  const memberId = username;

  const [isValid, setIsValid] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [keypadKey, setKeypadKey] = useState(0);

  const [errors, setErrors] = useState({});
  const [cardData, setCardData] = useState({
    cardNumber1: "",
    cardNumber2: "",
    cardNumber3: "",
    cardNumber4: "",
    cardCompany: "",
    cardExpirationYear: "",
    cardExpirationMonth: "",
    cardPassword: "",
    masterBirthday: "",
    cvcNumber: "",
    isSimplePaymentAgreed: false,
    isDefaultPaymentCard: false,
    memberId: "",
  });

  const inputRefs = {
    cardNumber1: useRef(),
    cardNumber2: useRef(),
    cardNumber3: useRef(),
    cardNumber4: useRef(),
    cardCompany: useRef(),
    cardExpirationYear: useRef(),
    cardExpirationMonth: useRef(),
    cardPassword: useRef(),
    masterBirthday: useRef(),
    cvcNumber: useRef(),
  };

  const inputOrder = [
    "cardCompany",
    "cardNumber1",
    "cardNumber2",
    "cardNumber3",
    "cardNumber4",
    "cardExpirationYear",
    "cardExpirationMonth",
    "cardPassword",
    "cvcNumber",
    "masterBirthday",
  ];

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const isCardNumberValid =
      cardData.cardNumber1.length === 4 &&
      cardData.cardNumber2.length === 4 &&
      cardData.cardNumber3.length === 4 &&
      cardData.cardNumber4.length === 4 &&
      /^\d+$/.test(
        cardData.cardNumber1 + cardData.cardNumber2 + cardData.cardNumber3 + cardData.cardNumber4
      );

    const isCardCompanySelected = cardData.cardCompany !== "";

    const isExpirationValid =
      cardData.cardExpirationYear !== "" &&
      cardData.cardExpirationMonth !== "" &&
      (parseInt(cardData.cardExpirationYear, 10) > currentYear ||
        (parseInt(cardData.cardExpirationYear, 10) === currentYear &&
          parseInt(cardData.cardExpirationMonth, 10) >= currentMonth));

    const isPasswordValid = /^\d{2}$/.test(cardData.cardPassword);
    const isCvcValid = /^\d{3}$/.test(cardData.cvcNumber);
    const isBirthdayValid = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/.test(
      cardData.masterBirthday
    );
    const isSimplePaymentAgreed = cardData.isSimplePaymentAgreed;

    const newIsValid =
      isCardNumberValid &&
      isCardCompanySelected &&
      isExpirationValid &&
      isPasswordValid &&
      isCvcValid &&
      isBirthdayValid &&
      isSimplePaymentAgreed;

    setIsValid(newIsValid);
  }, [cardData]);

  const validateInput = (name, value) => {
    let error = "";
    switch (name) {
      case "cardNumber1":
      case "cardNumber2":
      case "cardNumber3":
      case "cardNumber4":
        if (!/^\d{4}$/.test(value)) {
          error = "카드 번호는 4자리 숫자여야 합니다.";
        }
        break;
      case "cardPassword":
        if (!/^\d{2}$/.test(value)) {
          error = "비밀번호는 2자리 숫자여야 합니다.";
        }
        break;
      case "cvcNumber":
        if (!/^\d{3}$/.test(value)) {
          error = "CVC는 3자리 숫자여야 합니다.";
        }
        break;
      case "masterBirthday":
        if (!/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/.test(value)) {
          error = "생년월일은 YYYYMMDD 형식이어야 합니다. (예: 19900101)";
        }
        break;
    }
    return error;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (type !== "checkbox") {
      handleAutoFocus(name, value);
      const error = validateInput(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleAutoFocus = (name, value) => {
    const maxLength = getMaxLength(name);
    if (value.length === maxLength) {
      const currentIndex = inputOrder.indexOf(name);
      if (currentIndex < inputOrder.length - 1) {
        const nextInput = inputOrder[currentIndex + 1];
        setActiveInput(nextInput);
        inputRefs[nextInput].current.focus();
        setKeypadKey(prevKey => prevKey + 1);
      }
    }
  };

  const handleVirtualKeyPress = key => {
    if (activeInput) {
      setCardData(prev => {
        let newValue = prev[activeInput];
        if (key === "backspace") {
          newValue = newValue.slice(0, -1);
        } else if (key === "clear") {
          newValue = "";
        } else if (newValue.length < getMaxLength(activeInput)) {
          newValue += key;
        }

        handleAutoFocus(activeInput, newValue);

        return { ...prev, [activeInput]: newValue };
      });
    }
  };

  const getMaxLength = inputName => {
    if (inputName.startsWith("cardNumber")) return 4;
    if (inputName === "cardPassword") return 2;
    if (inputName === "cvcNumber") return 3;
    if (inputName === "masterBirthday") return 8;
    return 4; // default
  };

  const handleInputFocus = name => {
    if (
      name === "cardNumber2" ||
      name === "cardNumber3" ||
      name === "cardPassword" ||
      name === "cvcNumber"
    ) {
      setActiveInput(name);
      setKeypadKey(prevKey => prevKey + 1); // 키패드 키 증가
    } else {
      setActiveInput(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formattedData = {
      cardNumber: `${cardData.cardNumber1}-${cardData.cardNumber2}-${cardData.cardNumber3}-${cardData.cardNumber4}`,
      cardCompany: cardData.cardCompany,
      cardExpiration: `${cardData.cardExpirationMonth.padStart(2, "0")}${cardData.cardExpirationYear.slice(-2)}`,
      cardPassword: cardData.cardPassword,
      masterBirthday: `${cardData.masterBirthday.slice(0, 4)}-${cardData.masterBirthday.slice(4, 6)}-${cardData.masterBirthday.slice(6, 8)}`,
      cvcNumber: cardData.cvcNumber,
      isSimplePaymentAgreed: cardData.isSimplePaymentAgreed,
      isDefaultPaymentCard: cardData.isDefaultPaymentCard,
      memberId: memberId,
    };
    try {
      await onSubmit(formattedData);

      toast.success("카드가 성공적으로 등록되었습니다!", {
        style: {
          border: "1px solid #00835F",
          padding: "12px",
          color: "black",
        },
        iconTheme: {
          primary: "#00835F",
          secondary: "#FFFAEE",
        },
        duration: 2000,
        position: "bottom-center",
      });
      onClose();
    } catch (error) {
      toast.error("카드 등록에 실패했습니다. 다시 시도해 주세요.");
      console.error("카드 등록 오류:", error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title='카드 등록'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* 카드사 */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>카드사</label>
            <select
              name='cardCompany'
              value={cardData.cardCompany}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 p-2'
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

          {/* 카드 번호 */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>카드 번호</label>
            <div className='flex space-x-2'>
              {["cardNumber1", "cardNumber2", "cardNumber3", "cardNumber4"].map((name, index) => (
                <div key={name} className='flex-1'>
                  <input
                    type={index === 1 || index === 2 ? "password" : "tel"}
                    name={name}
                    value={cardData[name]}
                    onChange={handleChange}
                    onFocus={() => handleInputFocus(name)}
                    ref={inputRefs[name]}
                    readOnly={index === 1 || index === 2}
                    maxLength='4'
                    className={`w-full rounded-md border p-2 ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                    placeholder='●●●●'
                  />
                  {errors[name] && <p className='mt-1 text-xs text-red-500'>{errors[name]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* 카드 만료일 */}
          <div className='flex space-x-4'>
            <div className='flex-1'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>유효 년도</label>
              <select
                name='cardExpirationYear'
                value={cardData.cardExpirationYear}
                onChange={handleChange}
                onFocus={() => handleInputFocus("cardExpirationYear")}
                ref={inputRefs.cardExpirationYear}
                className='w-full rounded-md border border-gray-300 p-2'
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
              <label className='mb-1 block text-sm font-medium text-gray-700'>유효 월</label>
              <select
                name='cardExpirationMonth'
                value={cardData.cardExpirationMonth}
                onChange={handleChange}
                onFocus={() => handleInputFocus("cardExpirationMonth")}
                ref={inputRefs.cardExpirationMonth}
                className='w-full rounded-md border border-gray-300 p-2'
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

          {/* Card password and CVC */}
          <div className='flex space-x-4'>
            <div className='flex-1'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                카드 비밀번호 앞 두자리
              </label>
              <input
                type='password'
                name='cardPassword'
                value={cardData.cardPassword}
                onChange={handleChange}
                onFocus={() => handleInputFocus("cardPassword")}
                ref={inputRefs.cardPassword}
                readOnly
                className={`w-full rounded-md border p-2 ${
                  errors.cardPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
                placeholder='●●'
              />
              {errors.cardPassword && (
                <p className='mt-1 text-xs text-red-500'>{errors.cardPassword}</p>
              )}
            </div>
            <div className='flex-1'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>CVC</label>
              <input
                type='password'
                name='cvcNumber'
                value={cardData.cvcNumber}
                onChange={handleChange}
                onFocus={() => handleInputFocus("cvcNumber")}
                ref={inputRefs.cvcNumber}
                readOnly
                className={`w-full rounded-md border p-2 ${
                  errors.cvcNumber ? "border-red-500" : "border-gray-300"
                }`}
                required
                placeholder='카드 뒷면 3자리 숫자 입력'
              />
              {errors.cvcNumber && <p className='mt-1 text-xs text-red-500'>{errors.cvcNumber}</p>}
            </div>
          </div>

          {/* 생년월일 입력 */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>생년월일</label>
            <input
              type='tel'
              name='masterBirthday'
              value={cardData.masterBirthday}
              onChange={handleChange}
              onFocus={() => handleInputFocus("masterBirthday")}
              ref={inputRefs.masterBirthday}
              placeholder='20240808'
              maxLength='8'
              className={`w-full rounded-md border p-2 ${
                errors.masterBirthday ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.masterBirthday && (
              <p className='mt-1 text-xs text-red-500'>{errors.masterBirthday}</p>
            )}
          </div>

          {/* Checkboxes */}
          <div>
            <label className='flex items-center'>
              <input
                type='checkbox'
                required
                name='isSimplePaymentAgreed'
                checked={cardData.isSimplePaymentAgreed}
                onChange={handleChange}
                className='checkbox mr-3 border-gray-500 [--chkbg:#00835F] [--chkfg:white] checked:border-[#00835F]'
              />
              <span className='text-sm'>간편결제 동의 (필수)</span>
            </label>
          </div>
          <div>
            <label className='flex items-center'>
              <input
                type='checkbox'
                name='isDefaultPaymentCard'
                checked={cardData.isDefaultPaymentCard}
                onChange={handleChange}
                className='checkbox mr-3 border-gray-500 [--chkbg:#00835F] [--chkfg:white] checked:border-[#00835F]'
              />
              <span className='text-sm'>대표카드로 설정</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type='submit'
            className={`w-full rounded-md px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              isValid ? "bg-green-shine hover:bg-green-shine" : "cursor-not-allowed bg-gray-400"
            }`}
            disabled={!isValid}>
            카드 등록
          </button>
        </form>

        {activeInput && (
          <VirtualKeypad
            key={keypadKey} // 키 추가
            onKeyPress={handleVirtualKeyPress}
            maxLength={getMaxLength(activeInput)}
            onClose={() => setActiveInput(null)}
            currentValue={cardData[activeInput]}
          />
        )}
      </Modal>
    </>
  );
};

export default CardRegisterModal;
