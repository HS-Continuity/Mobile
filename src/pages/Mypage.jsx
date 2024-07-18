import { FaLock, FaCreditCard, FaTruck, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import BottomNav from "../components/Layouts/BottomNav";
import { BiSolidCoupon } from "react-icons/bi";
import MypageMenu from "../components/Mypage/MypageMenu";

const MyPage = () => {
  return (
    <>
      <div className='flex flex-col bg-gray-100'>
        {/* Menu Items */}
        <div className='flex-1 p-4'>
          <div className='space-y-4'>
            <MypageMenu icon={<FaLock />} text='개인정보 수정' to='/profile' />
            <MypageMenu icon={<BiSolidCoupon />} text='쿠폰함' to='/coupon' />
            <MypageMenu icon={<FaCreditCard />} text='결제수단 관리' to='/payment' />
            <MypageMenu icon={<FaTruck />} text='배송지 관리' to='/address' />
            <MypageMenu icon={<FaMapMarkerAlt />} text='주문내역 관리' to='/order-history' />
            <MypageMenu icon={<FaBox />} text='정기배송 관리' to='/subscription-history' />
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default MyPage;
