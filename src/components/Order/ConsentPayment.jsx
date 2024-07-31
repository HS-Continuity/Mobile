import React from "react";

const ConsentPayment = ({ consentPayment, finalPrice, handlePlaceOrder, isPaymentEnabled }) => {
  const handleOrderSubmit = e => {
    e.preventDefault();
    if (isPaymentEnabled) {
      handlePlaceOrder();
    }
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-gray-50'>
      <div className='main-container w-full'>
        <button
          className={`w-full p-4 text-lg font-bold text-white ${
            isPaymentEnabled ? "cursor-pointer bg-green-shine" : "cursor-not-allowed bg-gray-400"
          }`}
          onClick={handleOrderSubmit}
          disabled={!isPaymentEnabled}>
          {finalPrice.toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  );
};

export default ConsentPayment;
