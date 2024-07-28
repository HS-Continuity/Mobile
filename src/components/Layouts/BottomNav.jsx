import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CategoryMenu from "./CategoryMenu";
import { fetchCartItemsCount } from "../../apis";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdTime } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import logoWhite from "../../assets/images/logo_white.png";
import useAuthStore from "../../stores/useAuthStore";

const BottomNav = () => {
  const { username, isAuthenticated } = useAuthStore();
  const memberId = username;
  // const memberId = import.meta.env.VITE_MEMBER_ID;
  const cartTypeId = null;
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: cartItemsCount, isLoading } = useQuery({
    queryKey: ["cart", memberId, cartTypeId],
    queryFn: () => fetchCartItemsCount(memberId, cartTypeId),
    enabled: !!isAuthenticated && !!memberId,
  });

  const navItems = [
    { icon: RxHamburgerMenu, label: "카테고리", action: () => setIsCategoryOpen(true) },
    { icon: IoMdTime, label: "타임세일", path: "/timesale" },
    { icon: null, label: "", path: "/" }, // 아이콘을 null로 설정
    { icon: HiOutlineUser, label: "내정보", path: "/mypage" },
    { icon: IoCartOutline, label: "카트", path: "/cart" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeNavItem = navItems.find(item => item.path === currentPath);
    if (activeNavItem) {
      setActiveItem(activeNavItem.label);
    } else {
      setActiveItem("");
    }
  }, [location]);

  const handleNavigation = item => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
      setActiveItem(item.label);
    }
  };

  const getItemStyle = label => {
    if (label === "타임세일" || label === "내정보") {
      return activeItem === label ? "text-black" : "text-gray-500";
    }
    return label === "" ? "text-white" : "text-gray-500";
  };

  return (
    <>
      <CategoryMenu isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      <nav className='main-container fixed bottom-0 left-0 right-0 z-40 mx-auto w-full border-t border-gray-200 bg-white'>
        <div className='flex items-end justify-around'>
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className={`relative flex flex-1 flex-col items-center py-1 ${
                label === "" ? "-mt-5" : ""
              }`}
              onClick={() => handleNavigation(navItems.find(item => item.label === label))}>
              <div
                className={`relative flex items-center justify-center ${
                  label === "" ? "rounded-full bg-green-shine p-[10px] shadow-lg" : ""
                }`}>
                {label === "" ? (
                  <div className='flex h-10 w-10 items-center justify-center'>
                    <img
                      src={logoWhite}
                      alt='Logo'
                      className='max-h-full max-w-full object-contain'
                    />
                  </div>
                ) : (
                  Icon && (
                    <Icon
                      className={`h-6 w-6 ${getItemStyle(label)} ${label === "" ? "h-8 w-8" : ""}`}
                    />
                  )
                )}
                {label === "카트" && isAuthenticated && cartItemsCount > 0 && (
                  <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${getItemStyle(label)} ${label === "" ? "mt-1" : ""}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
