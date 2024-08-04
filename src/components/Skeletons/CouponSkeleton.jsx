const CouponSkeleton = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className='mb-4 h-8 w-48 rounded border bg-white'></div>
      {[...Array(1)].map((_, index) => (
        <div key={index} className='card mb-4 animate-pulse bg-gray-100 shadow-md'>
          <div className='card-body'>
            <div className='mb-2 h-6 w-3/4 rounded bg-gray-200'></div>
            <div className='mb-2 h-8 w-1/4 rounded bg-gray-200'></div>
            <div className='flex items-center justify-between'>
              <div className='h-6 w-1/3 rounded bg-gray-200'></div>
              <div className='h-10 w-1/4 rounded bg-gray-200'></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CouponSkeleton;
