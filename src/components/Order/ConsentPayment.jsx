import { useNavigate } from "react-router-dom";

const ConsentPayment = ({ consentPayment, finalPrice }) => {
  const navigate = useNavigate();

  const handleOrderSuccess = e => {
    e.preventDefault();
    navigate("/order-success");
  };

  return (
    <>
      <div className='fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-gray-100'>
        <div className='main-container w-full'>
          <button
            className={`w-full bg-[#00835F] p-4 text-lg font-bold text-white ${
              consentPayment ? "" : "cursor-not-allowed bg-gray-400"
            }`}
            onClick={handleOrderSuccess}
            disabled={!consentPayment}>
            {finalPrice.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </>
  );
};

export default ConsentPayment;
