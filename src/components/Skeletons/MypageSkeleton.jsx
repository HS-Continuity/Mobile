const MyPageSkeleton = () => {
  return (
    <div className='flex flex-col bg-white'>
      <main className='flex-1'>
        <div className='overflow-hidden'>
          <div className='flex h-48 w-full animate-pulse flex-col items-center justify-center bg-gray-300'>
            <div className='mb-4 h-8 w-32 rounded-full bg-gray-400'></div>
            <div className='mb-2 h-4 w-24 rounded-full bg-gray-400'></div>
            <div className='mb-2 h-4 w-28 rounded-full bg-gray-400'></div>
            <div className='h-4 w-20 rounded-full bg-gray-400'></div>
          </div>
          {[...Array(6)].map((_, index) => (
            <div key={index} className='flex items-center border-b p-4'>
              <div className='mr-4 h-8 w-8 rounded-full bg-gray-300'></div>
              <div className='h-4 w-24 rounded bg-gray-300'></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyPageSkeleton;
