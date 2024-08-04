import { BiSolidCoupon } from "react-icons/bi";
import { FaBox, FaCreditCard, FaLock, FaMapMarkerAlt, FaTruck } from "react-icons/fa";

const menuItems = [
  { icon: <FaLock />, text: "개인정보 수정", to: "/profile" },
  { icon: <BiSolidCoupon />, text: "쿠폰함", to: "/coupon" },
  { icon: <FaCreditCard />, text: "결제수단 관리", to: "/payment" },
  { icon: <FaTruck />, text: "배송지 관리", to: "/address" },
  { icon: <FaMapMarkerAlt />, text: "주문내역 관리", to: "/order-history" },
  { icon: <FaBox />, text: "정기배송 관리", to: "/subscription-history" },
];

export default menuItems;
