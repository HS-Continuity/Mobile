import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { FaHome } from "react-icons/fa";

const MypageHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getHeaderText = () => {
    if (location.pathname === "/mypage") {
      return "마이 페이지";
    } else if (location.pathname === "/profile") {
      return "개인정보 수정";
    } else if (location.pathname === "/coupon") {
      return "쿠폰함";
    } else if (location.pathname === "/address") {
      return "배송지 관리";
    } else if (location.pathname === "/payment") {
      return "결제수단 관리";
    } else if (location.pathname === "/order-history") {
      return "주문내역 관리";
    } else if (location.pathname.startsWith("/order-history/")) {
      return "주문 상세 정보";
    } else if (location.pathname === "/subscription-history") {
      return "정기배송 관리";
    } else if (location.pathname.startsWith("/subscription-history")) {
      return "정기배송 상세관리";
    } else if (location.pathname.startsWith("/reviewapply/")) {
      return "리뷰 작성";
    } else if (location.pathname === "/refundapply") {
      return "환불 신청";
    } else if (location.pathname === "/subscription-manage") {
      return "정기배송 상세관리";
    }
    return "";
  };

  return (
    <div className='flex items-center border-b-2 border-gray-100 p-4'>
      <MdArrowBackIosNew className='mr-auto cursor-pointer text-2xl' onClick={() => navigate(-1)} />
      <FaHome className='ml-4 cursor-pointer text-xl' onClick={() => navigate("/")} />
      <h1 className='mr-[60px] flex-grow text-center text-xl font-semibold'>{getHeaderText()}</h1>
    </div>
  );
};

export default MypageHeader;
