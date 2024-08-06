import { FiX } from "react-icons/fi";

const RecentSearches = ({ recentSearches, handleRecentSearchClick, removeSearch }) => {
  return (
    <>
      {recentSearches.length > 0 && (
        <div className='rounded-lg bg-white p-4 pb-0'>
          <h2 className='mb-2 font-bold'>최근 검색어</h2>
          <div className='flex flex-wrap gap-2'>
            <ul className='flex'>
              {recentSearches.map((search, index) => (
                <li
                  key={index}
                  className='mr-1 flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs'>
                  <button
                    onClick={() => handleRecentSearchClick(search)}
                    className='flex-grow text-left hover:text-[#00835F]'>
                    {search}
                  </button>
                  <button
                    onClick={() => removeSearch(search)}
                    className='-mr-2 ml-2 rounded-full bg-gray-400 p-1 text-gray-100'>
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <hr className='mt-3' />
        </div>
      )}
    </>
  );
};

export default RecentSearches;
