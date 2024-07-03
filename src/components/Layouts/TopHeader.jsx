import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const TopHeader = () => {
  return (
    <>
      <header className='bg-[#00835F] p-4 text-white'>
        <div className='flex'>
          <div className='text-xl font-extrabold'>연이음</div>
          <p className='ml-2 mt-1 text-sm'>연이은 배송, 그 연을 잇다.</p>
        </div>
        <Link
          to='/search'
          className='mt-2 flex items-center rounded-full bg-white px-3 py-1 text-gray-600'>
          <FiSearch className='mr-2' />
          <span className='text-sm'>검색</span>
        </Link>
      </header>
    </>
  );
};

export default TopHeader;
