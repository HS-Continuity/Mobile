import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { FaHome } from "react-icons/fa";

const OrderHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getHeaderText = () => {
    const previousPath = location.state?.from;
    console.log(previousPath);

    if (location.pathname === "/cart") {
      return "장바구니";
    } else if (location.pathname === "/order") {
      return previousPath?.startsWith("/timesale") ? "타임세일 주문" : "일반 상품 주문";
    } else if (location.pathname === "/subscription-setup") {
      return "정기 배송 설정";
    } else if (location.pathname === "/subscription-order") {
      return "정기 배송 주문";
    } else if (location.pathname === "/order-success") {
      return "결제 성공";
    } else if (location.pathname === "/order-fail") {
      return "결제 실패";
    }
    return "";
  };

  return (
    <div className='sticky bottom-0 left-0 right-0 flex items-center border-b-2 border-gray-100 p-4'>
      <MdArrowBackIosNew className='mr-auto cursor-pointer text-2xl' onClick={() => navigate(-1)} />
      <FaHome className='ml-4 cursor-pointer text-xl' onClick={() => navigate("/")} />
      <h1 className='mr-[60px] flex-grow text-center text-xl font-semibold'>{getHeaderText()}</h1>
    </div>
  );
};

export default OrderHeader;
