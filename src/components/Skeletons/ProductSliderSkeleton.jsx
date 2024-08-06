const ProductSliderSkeleton = () => {
  return (
    <div className='slider-container mb-5'>
      <div className='relative w-full' style={{ paddingTop: "78%" }}>
        {/* 16:9 aspect ratio */}
        <div className='absolute inset-0 animate-pulse rounded-lg bg-gray-300'></div>
      </div>
      <div className='mt-4 flex justify-center'>
        {[...Array(5)].map((_, index) => (
          <div key={index} className='mx-1 ml-5 h-2 w-2 rounded-full bg-gray-300'></div>
        ))}
      </div>
    </div>
  );
};

export default ProductSliderSkeleton;
