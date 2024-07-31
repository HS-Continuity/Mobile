import { FaLock, FaCreditCard, FaTruck, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import { BiSolidCoupon } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import BottomNav from "../../components/Layouts/BottomNav";
import MypageMenu from "./MypageMenu";
import useAuthStore from "../../stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { fetchMemberInfo } from "../../apis";
import { Link } from "react-router-dom";

const MyPage = () => {
  const { username } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["memberIdName", username],
    queryFn: () => fetchMemberInfo(String(username)),
  });

  const menuItems = [
    { icon: <FaLock />, text: "개인정보 수정", to: "/profile" },
    { icon: <BiSolidCoupon />, text: "쿠폰함", to: "/coupon" },
    { icon: <FaCreditCard />, text: "결제수단 관리", to: "/payment" },
    { icon: <FaTruck />, text: "배송지 관리", to: "/address" },
    { icon: <FaMapMarkerAlt />, text: "주문내역 관리", to: "/order-history" },
    { icon: <FaBox />, text: "정기배송 관리", to: "/subscription-history" },
  ];

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;

  return (
    <div className='flex flex-col bg-white'>
      <main className='flex-1'>
        <div className='overflow-hidden'>
          <div className='flex h-48 w-full flex-col items-center justify-center bg-green-shine'>
            <div className='flex items-center justify-center'>
              <h1 className='text-3xl font-bold text-white'>{data?.memberName}</h1>
              <h1 className='ml-1 mt-2 text-xl font-bold text-white'>님</h1>
              <Link to='/profile'>
                <FaChevronRight className='text-md -mt-1 ml-3 text-white' />
              </Link>
            </div>
            <p className='mt-6 text-xl font-light text-white'>연이음에서,</p>
            <p className='text-xl font-light text-white'>연이은 배송으로,</p>
            <p className='text-xl font-light text-white'>연을 이어보아요</p>
          </div>
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
