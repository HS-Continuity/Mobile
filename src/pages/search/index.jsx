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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword") || "";

  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { recentSearches, addSearch, removeSearch, clearSearches } = useSearchStore();

  const { data: popularKeywords } = useQuery({
    queryKey: ["popularKeywords"],
    queryFn: fetchPopularKeyword,
    refetchInterval: 600000,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleRecentSearchClick = search => {
    setSearchQuery(search);
    performSearch(search);
  };

  const performSearch = searchTerm => {
    addSearch(searchTerm.trim());
    const searchPath = `/search-result?keyword=${encodeURIComponent(searchTerm.trim())}`;
    navigate(searchPath);
  };

  return (
    <div className='main-container h-full w-full overflow-y-auto bg-white'>
      <div className='p-4'>
        <form onSubmit={handleSearchSubmit} className='relative mb-4 flex'>
          <MdArrowBackIosNew
            className='mt-[5px] cursor-pointer text-2xl'
            onClick={() => navigate(-1)}
          />
          <input
            ref={inputRef}
            type='text'
            placeholder='검색어를 입력해주세요.'
            className='input input-bordered ml-5 h-[35px] w-full rounded-full pl-10'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <FiSearch className='absolute left-14 top-1/2 -translate-y-1/2 text-gray-400' />
          {searchQuery && (
            <FiX
              className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400'
              onClick={() => setSearchQuery("")}
            />
          )}
        </form>

        <RecentSearches
          recentSearches={recentSearches}
          handleRecentSearchClick={handleRecentSearchClick}
          removeSearch={removeSearch}
          clearSearches={clearSearches}
        />

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
