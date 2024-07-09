import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdTimer } from "react-icons/md";
import CategoryMenu from "./CategoryMenu";

const BottomNav = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: GiHamburgerMenu, label: "카테고리", action: () => setIsCategoryOpen(true) },
    { icon: MdTimer, label: "타임어택", path: "/timesale" },
    { icon: FaHome, label: "", path: "/" },
    { icon: FaUser, label: "내정보", path: "/mypage" },
    { icon: FaShoppingCart, label: "카트", path: "/cart" },
  ];

  const handleNavigation = item => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <CategoryMenu isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      <nav className='fixed bottom-0 left-0 right-0 z-40 mx-auto w-full border-t border-gray-200 bg-white sm:max-w-full md:max-w-full lg:max-w-[500px] xl:max-w-[500px]'>
        <div className='flex justify-around'>
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className='flex flex-1 flex-col items-center py-2'
              onClick={() => handleNavigation(navItems.find(item => item.label === label))}>
              <div
                className={`flex items-center justify-center ${label === "" ? "rounded-full bg-[#00835F] p-2" : ""}`}>
                <Icon className={`h-6 w-6 ${label === "" ? "text-white" : ""}`} />
              </div>
              <span className='text-xs'>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
