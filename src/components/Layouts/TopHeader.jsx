import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import CategoryNav from "./CategoryNav";
import useAuthStore from "../../stores/useAuthStore";

const TopHeader = () => {
  const [isTopVisible, setIsTopVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const lastScrollTop = useRef(0);
  const ticking = useRef(false);
  const SCROLL_THRESHOLD = 50;

  const { isAuthenticated, username, logout } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    username: state.username,
    logout: state.logout,
  }));

  const categories = [
    { name: "일반", path: "/general" },
    { name: "친환경", path: "/eco" },
    { name: "타임세일", path: "/timesale" },
  ];

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const mainElement = document.querySelector("main");
        if (!mainElement) return;

        const scrollTop = mainElement.scrollTop;
        const scrollDifference = Math.abs(scrollTop - lastScrollTop.current);

        if (scrollDifference > SCROLL_THRESHOLD) {
          if (scrollTop > lastScrollTop.current && scrollTop > SCROLL_THRESHOLD) {
            setIsTopVisible(false);
          } else if (scrollTop < lastScrollTop.current) {
            setIsTopVisible(true);
          }
          lastScrollTop.current = scrollTop;
        }

        ticking.current = false;
      });

      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className='main-container sticky top-0 z-50 bg-white shadow-sm'>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isTopVisible ? "max-h-20" : "max-h-0"
        }`}>
        <div className='mx-auto flex items-center justify-between p-2'>
          <div className='mx-auto grid grid-cols-3 items-center justify-between'>
            <Link
              to='/'
              className='col-span-1 -ml-3 flex justify-center text-2xl font-extrabold text-[#00835F]'>
              연이음
            </Link>
            <div className='relative col-span-1 flex flex-grow items-center'>
              <div
                className='input input-bordered -ml-[3px] h-[35px] w-[190px] cursor-pointer rounded-full pl-10 sm:w-[300px] md:w-[600px] lg:w-[190px]'
                onClick={handleSearchClick}>
                <FiSearch className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400' />
              </div>
            </div>
            {isAuthenticated ? (
              <div className='col-span-1 -ml-1 flex justify-center text-base text-[#00835F]'>
                {/* <span>🌿{username}</span> */}
                <button
                  onClick={handleLogout}
                  className='col-span-1 -ml-1 flex justify-center text-base text-[#00835F]'>
                  🌿로그아웃
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                className='col-span-1 -ml-1 flex justify-center text-base text-[#00835F]'>
                🌿로그인
              </Link>
            )}
          </div>
        </div>
      </div>
      {location.pathname !== "/search" && <CategoryNav categories={categories} />}
    </header>
  );
};

export default TopHeader;
