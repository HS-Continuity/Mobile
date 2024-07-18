import { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { MdArrowBackIosNew } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TopHeader = () => {
  const [isTopVisible, setIsTopVisible] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const lastScrollTop = useRef(0);
  const ticking = useRef(false);
  const SCROLL_THRESHOLD = 50; // 스크롤 임계값 설정

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

  const categories = [
    { name: "일반", path: "/general" },
    { name: "친환경", path: "/eco" },
    { name: "타임세일", path: "/timesale" },
  ];

  const handleSearchFocus = () => {
    setIsSearchMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchMode(false);
    }
  };

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchMode(false);
    }
  };

  return (
    <>
      <header className='main-container sticky top-0 z-50 bg-white shadow-sm'>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isTopVisible ? "max-h-20" : "max-h-0"
          }`}>
          <div className='mx-auto flex items-center justify-between p-2'>
            <div className='ml-10 flex w-full items-center space-x-12'>
              {!isSearchMode ? (
                <Link to='/' className='text-xl font-extrabold text-[#00835F]'>
                  연이음
                </Link>
              ) : (
                <MdArrowBackIosNew
                  className='mr-auto cursor-pointer text-2xl'
                  onClick={handleSearchClose}
                />
              )}
              <form
                onSubmit={handleSearchSubmit}
                className={`relative flex-grow ${isSearchMode ? "w-full" : ""}`}>
                <input
                  ref={inputRef}
                  type='text'
                  placeholder={`${isSearchMode ? "검색어를 입력해주세요." : ""}`}
                  className={`input input-bordered h-[40px] ${isSearchMode ? "w-full" : "w-[300px]"} pl-10`}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                {isSearchMode && (
                  <FiX
                    className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400'
                    onClick={() => setSearchQuery("")}
                  />
                )}
              </form>
            </div>
          </div>
        </div>
        {!isSearchMode && location.pathname !== "/search" && (
          <nav className='main-container w-full border-b border-gray-200'>
            <ul className='flex w-full justify-between'>
              {categories.map(category => (
                <li key={category.path} className='flex-1'>
                  <Link
                    to={category.path}
                    className={`flex h-full w-full items-center justify-center px-1 py-3 text-sm font-semibold ${
                      location.pathname === category.path
                        ? "border-b-2 border-[#00835F] text-[#00835F]"
                        : "text-gray-500 hover:text-[#00835F]"
                    }`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      {isSearchMode && (
        <div className='fixed inset-0 z-40 flex items-start justify-center pt-20 lg:pt-0'>
          <div className='main-container h-full w-full overflow-y-auto bg-white lg:mt-14'>
            <div className='p-4'>
              <h3 className='mb-2 font-bold'>최근 검색어</h3>
              <ul>
                <li className='py-1'>검색어 1</li>
                <li className='py-1'>검색어 2</li>
                <li className='py-1'>검색어 3</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopHeader;
