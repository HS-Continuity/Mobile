import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import PopularKeywordTicker from "./PopularKeywordTicker";

const SearchBar = ({
  isSearchMode,
  searchQuery,
  inputRef,
  handleSearchFocus,
  handleSearchBlur,
  handleSearchClose,
  handleSearchSubmit,
  setSearchQuery,
  popularKeywords,
  performSearch,
}) => {
  return (
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
        <div className='relative flex flex-grow items-center'>
          <form
            onSubmit={handleSearchSubmit}
            className={`relative flex-grow ${isSearchMode ? "w-full" : ""}`}>
            <input
              ref={inputRef}
              type='text'
              placeholder={`${isSearchMode ? "검색어를 입력해주세요." : ""}`}
              className={`input input-bordered h-[35px] ${
                isSearchMode ? "w-full-important" : "w-[190px]"
              } rounded-full pl-10 sm:w-[300px] md:w-[600px] lg:w-[190px]`}
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
          {popularKeywords && popularKeywords.length > 0 && !isSearchMode && (
            <PopularKeywordTicker keywords={popularKeywords} onKeywordClick={performSearch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
