const PopularKeywordsSkeleton = () => (
  <div className='my-4 ml-4'>
    <h2 className='mb-2 font-bold'>인기 검색어</h2>
    <div className='grid grid-cols-2 gap-2'>
      {[...Array(10)].map((_, index) => (
        <div key={index} className='flex items-center'>
          <div className='mr-2 h-6 w-6 animate-pulse rounded-full bg-gray-200'></div>
          <div className='h-4 w-16 animate-pulse rounded bg-gray-200'></div>
        </div>
      ))}
    </div>
  </div>
);

export default PopularKeywordsSkeleton;
