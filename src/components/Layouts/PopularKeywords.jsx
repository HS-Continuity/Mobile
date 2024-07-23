import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const PopularKeywords = ({ popularKeywords, handleRecentSearchClick }) => {
  return (
    <div className='p-4'>
      <h3 className='mb-2 font-bold'>인기 검색어</h3>
      <div className='grid grid-cols-2 gap-4'>
        <ul className='grid grid-cols-1 gap-2'>
          {popularKeywords.slice(0, 4).map((search, index) => (
            <li key={index} className='flex items-center'>
              <span className='mr-2 font-bold text-gray-500'>{index + 1}</span>
              <button
                onClick={e => (
                  e.preventDefault(),
                  e.stopPropagation(),
                  handleRecentSearchClick(search.searchName)
                )}
                className='flex-grow text-left hover:text-[#00835F]'>
                <span className='flex items-center'>
                  {search.rankChange !== 0 && (
                    <span
                      className={`mr-1 ${search.rankChange > 0 ? "text-red-500" : "text-blue-500"}`}>
                      {search.rankChange > 0 ? (
                        <FaArrowUp className='inline' />
                      ) : (
                        <FaArrowDown className='inline' />
                      )}
                      <span className='ml-1 text-xs'>{Math.abs(search.rankChange)}</span>
                    </span>
                  )}
                  {search.searchName}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <ul className='grid grid-cols-1 gap-2'>
          {popularKeywords.slice(4, 8).map((search, index) => (
            <li key={index + 4} className='flex items-center'>
              <span className='mr-2 font-bold text-gray-500'>{index + 5}</span>
              <button
                onClick={e => (
                  e.preventDefault(),
                  e.stopPropagation(),
                  handleRecentSearchClick(search.searchName)
                )}
                className='flex-grow text-left hover:text-[#00835F]'>
                <span className='flex items-center'>
                  {search.rankChange !== 0 && (
                    <span
                      className={`mr-1 ${search.rankChange > 0 ? "text-red-500" : "text-blue-500"}`}>
                      {search.rankChange > 0 ? (
                        <FaArrowUp className='inline' />
                      ) : (
                        <FaArrowDown className='inline' />
                      )}
                      <span className='ml-1 text-xs'>{Math.abs(search.rankChange)}</span>
                    </span>
                  )}
                  {search.searchName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PopularKeywords;
