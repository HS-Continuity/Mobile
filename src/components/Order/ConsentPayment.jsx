import { useNavigate } from "react-router-dom";

const ConsentPayment = ({ consentPayment, finalPrice }) => {
  const navigate = useNavigate();

  const handleOrderSuccess = e => {
    e.preventDefault();
    navigate("/order-success");
  };

  return (
    <>
      <button
        className={`bg-[#00835F] p-4 text-lg font-bold text-white ${
          consentPayment ? "" : "cursor-not-allowed bg-gray-400"
        }`}
        onClick={handleOrderSuccess}
        disabled={!consentPayment}>
        {finalPrice.toLocaleString()}원 결제하기
      </button>
    </>
  );
};

export default ConsentPayment;
