import { FaLock, FaCreditCard, FaTruck, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import { BiSolidCoupon } from "react-icons/bi";
import BottomNav from "../../components/Layouts/BottomNav";
import MypageMenu from "./MypageMenu";

const MyPage = () => {
  const menuItems = [
    { icon: <FaLock />, text: "개인정보 수정", to: "/profile" },
    { icon: <BiSolidCoupon />, text: "쿠폰함", to: "/coupon" },
    { icon: <FaCreditCard />, text: "결제수단 관리", to: "/payment" },
    { icon: <FaTruck />, text: "배송지 관리", to: "/address" },
    { icon: <FaMapMarkerAlt />, text: "주문내역 관리", to: "/order-history" },
    { icon: <FaBox />, text: "정기배송 관리", to: "/subscription-history" },
  ];

  return (
    <div className='flex flex-col bg-white'>
      {/* Menu Items */}
      <main className='flex-1'>
        <div className='overflow-hidden'>
          {menuItems.map((item, index) => (
            <MypageMenu
              key={index}
              icon={<span className='text-[#00835F]'>{item.icon}</span>}
              text={item.text}
              to={item.to}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MyPage;
