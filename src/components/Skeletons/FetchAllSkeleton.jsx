import { IoRefreshCircleOutline } from "react-icons/io5";

const FetchAllSkeleton = ({ name }) => {
  return (
    <>
      <div className='mt-7 text-center'>
        <p className='mb-1 text-gray-600'>모든 {name} 불러왔습니다.</p>
        <IoRefreshCircleOutline
          className='mx-auto cursor-pointer text-3xl text-gray-500 transition-colors duration-300 hover:text-gray-700'
          onClick={() => window.location.reload()}
        />
      </div>
    </>
  );
};

export default FetchAllSkeleton;
