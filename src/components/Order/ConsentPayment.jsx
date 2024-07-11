const ConsentPayment = ({ consentPayment, finalPrice }) => {
  return (
    <>
      <button
        className={`bg-[#00835F] p-4 text-lg font-bold text-white ${
          consentPayment ? "" : "cursor-not-allowed bg-gray-400"
        }`}
        disabled={!consentPayment}>
        {finalPrice.toLocaleString()}원 결제하기
      </button>
    </>
  );
};

export default ConsentPayment;
