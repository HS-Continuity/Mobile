const AddressSkeleton = () => {
  return (
    <div className='animate-pulse'>
      {[...Array(3)].map((_, index) => (
        <div key={index} className='mb-4 rounded-lg border p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='h-6 w-24 rounded bg-gray-200'></div>
              <div className='ml-2 h-6 w-20 rounded bg-gray-200'></div>
            </div>
            <div>
              <div className='h-6 w-16 rounded bg-gray-200'></div>
            </div>
          </div>
          <div className='mt-2 h-4 w-3/4 rounded bg-gray-200'></div>
          <div className='mt-2 h-4 w-1/2 rounded bg-gray-200'></div>
          <div className='mt-2 h-4 w-1/3 rounded bg-gray-200'></div>
        </div>
      ))}
    </div>
  );
};

export default AddressSkeleton;
