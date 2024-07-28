import { useLocation, useNavigate } from "react-router-dom";
import { useSearchProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";
import { useEffect, useRef, useState } from "react";
import { useSearchStore } from "../../stores/useSearchStore";
import { FiSearch, FiX } from "react-icons/fi";
import { MdArrowBackIosNew } from "react-icons/md";

const SearchResult = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword") || "";
  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { addSearch } = useSearchStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSearchQuery(initialKeyword);
  }, [initialKeyword]);

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const performSearch = searchTerm => {
    addSearch(searchTerm);
    const searchPath = `/search-result?keyword=${searchTerm}`;
    navigate(searchPath);
  };

  return (
    <div>
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
                onClick={() => navigate("/search")}
              />
            )}
          </form>
          <h2 className='mb-4 text-2xl font-bold'>{initialKeyword} 검색 결과</h2>
          <ProductList
            useQueryHook={useSearchProductsQuery}
            additionalProps={initialKeyword}
            gridCols={2}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
