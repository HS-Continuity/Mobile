import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import CategoryNav from "./CategoryNav";

const TopHeader = () => {
  const [isTopVisible, setIsTopVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const lastScrollTop = useRef(0);
  const ticking = useRef(false);
  const SCROLL_THRESHOLD = 50;

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

  return (
    <header className='main-container sticky top-0 z-50 bg-white shadow-sm'>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isTopVisible ? "max-h-20" : "max-h-0"
        }`}>
        <div className='mx-auto flex items-center justify-between p-2'>
          <div className='ml-10 flex w-full items-center space-x-12'>
            <Link to='/' className='text-xl font-extrabold text-[#00835F]'>
              연이음
            </Link>
            <div className='relative flex flex-grow items-center'>
              <div
                className='input input-bordered h-[35px] w-[190px] cursor-pointer rounded-full pl-10 sm:w-[300px] md:w-[600px] lg:w-[190px]'
                onClick={handleSearchClick}>
                <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              </div>
            </div>
          </div>
        </div>
      </div>
      {location.pathname !== "/search" && <CategoryNav categories={categories} />}
    </header>
  );
};

export default TopHeader;
