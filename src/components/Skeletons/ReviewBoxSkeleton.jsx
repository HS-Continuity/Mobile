const ReviewBoxSkeleton = () => {
  return (
    <div className='mb-4 animate-pulse rounded-lg border p-4'>
      <div className='mb-2 flex items-center'>
        <div className='h-5 w-24 rounded bg-gray-200'></div>
        <div className='ml-2 h-4 w-20 rounded bg-gray-200'></div>
        <div className='ml-2 h-4 w-24 rounded bg-gray-200'></div>
      </div>
      <div className='h-3 w-32 rounded bg-gray-200'></div>
      <div className='mt-2 h-16 w-full rounded bg-gray-200'></div>
    </div>
  );
};

export default ReviewBoxSkeleton;
