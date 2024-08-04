const CategorySkeleton = () => {
  const skeletonItems = Array(10).fill(null);

  return (
    <div className='noScrollbar flex-grow overflow-y-auto p-4'>
      {[0, 1, 2].map(rowIndex => (
        <div key={rowIndex} className='mb-6 mt-3 grid grid-cols-5 gap-1'>
          {skeletonItems.slice(rowIndex * 5, (rowIndex + 1) * 5).map((_, index) => (
            <div key={index} className='flex flex-col items-center justify-center'>
              <div className='mb-3 h-16 w-16 animate-pulse rounded-xl bg-gray-200'></div>
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200'></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
