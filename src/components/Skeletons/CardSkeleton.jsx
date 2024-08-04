const CardSkeleton = () => {
  return (
    <div className='animate-pulse space-y-4'>
      {[...Array(3)].map((_, index) => (
        <div key={index} className='card bg-base-100'>
          <div className='card-body rounded-2xl border border-gray-200 p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 rounded-full bg-gray-300'></div>
                <div>
                  <div className='h-5 w-24 rounded bg-gray-300'></div>
                  <div className='mt-2 h-4 w-36 rounded bg-gray-300'></div>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='h-6 w-24 rounded bg-gray-300'></div>
                <div className='h-8 w-8 rounded-full bg-gray-300'></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
