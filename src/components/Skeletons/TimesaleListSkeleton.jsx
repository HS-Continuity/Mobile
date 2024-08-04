const TimesaleListSkeleton = ({ count = 5, gridCols = 1 }) => {
  return (
    <div className={`grid grid-cols-${gridCols} gap-4`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className='animate-pulse rounded-lg bg-white p-4'>
          <div className='relative mb-1 pb-[100%]'>
            <div className='absolute inset-0 rounded-md bg-gray-300'></div>
          </div>
          <div className='mb-1 h-4 w-3/4 rounded bg-gray-300'></div>
          <div className='mb-1 h-6 w-1/4 rounded bg-gray-300'></div>
          <div className='mb-1 h-4 w-1/2 rounded bg-gray-300'></div>
        </div>
      ))}
    </div>
  );
};

export default TimesaleListSkeleton;
