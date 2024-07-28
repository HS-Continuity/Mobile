import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { useSearchStore } from "../../stores/useSearchStore";
import { fetchPopularKeyword } from "../../apis";
import RecentSearches from "../../components/Layouts/RecentSearches";
import PopularKeywords from "../../components/Layouts/PopularKeywords";
import { MdArrowBackIosNew } from "react-icons/md";

const SearchPage = () => {
  // 현재 URL에서 검색어 추출
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword") || "";

  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { recentSearches, addSearch, removeSearch, clearSearches } = useSearchStore();

  // 인기 검색어 데이터 가져오기 (10분 마다 업데이트)
  const { data: popularKeywords } = useQuery({
    queryKey: ["popularKeywords"],
    queryFn: fetchPopularKeyword,
    // refetchInterval: 600000,
  });

  // 페이지 로드 시 검색 input에 자동 focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 검색 submit 핸들러
  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  // 최근 검색어 클릭 핸들러
  const handleRecentSearchClick = search => {
    setSearchQuery(search);
    performSearch(search);
  };

  // 검색 실행 함수 (검색어 저장, 검색 결과 페이지로 이동)
  const performSearch = searchTerm => {
    addSearch(searchTerm.trim());
    const searchPath = `/search-result?keyword=${searchTerm.trim()}`;
    navigate(searchPath);
  };

  return (
    <div className='main-container h-full w-full overflow-y-auto bg-white'>
      <div className='p-4'>
        {/* 검색창 */}
        <form onSubmit={handleSearchSubmit} className='relative mb-4 flex'>
          {/* 뒤로가기 버튼 */}
          <MdArrowBackIosNew
            className='mt-[5px] cursor-pointer text-2xl'
            onClick={() => navigate(-1)}
          />
          {/* 검색 input */}
          <input
            ref={inputRef}
            type='text'
            placeholder='검색어를 입력해주세요.'
            className='input input-bordered ml-5 h-[35px] w-full rounded-full pl-10'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {/* 검색 아이콘 */}
          <FiSearch className='absolute left-14 top-1/2 -translate-y-1/2 text-gray-400' />
          {/* 검색어 입력 시 X 버튼 표시 */}
          {searchQuery && (
            <FiX
              className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400'
              onClick={() => setSearchQuery("")}
            />
          )}
        </form>

        {/* 최근 검색어 */}
        <RecentSearches
          recentSearches={recentSearches}
          handleRecentSearchClick={handleRecentSearchClick}
          removeSearch={removeSearch}
          clearSearches={clearSearches}
        />

        {/* 인기 검색어 */}
        {popularKeywords && popularKeywords.length > 0 && (
          <PopularKeywords
            popularKeywords={popularKeywords}
            handleRecentSearchClick={handleRecentSearchClick}
          />
        )}
      </div>
    </div>
  );
};
export default SearchPage;
