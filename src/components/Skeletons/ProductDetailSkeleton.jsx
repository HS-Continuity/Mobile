const ProductDetailSkeleton = () => (
  <div className='mx-auto animate-pulse bg-gray-50'>
    {/* 상품 이미지 placeholder */}
    <div className='h-96 w-full bg-gray-300'></div>

    <div className='mb-3 bg-white p-4'>
      {/* 상품 이름 및 판매자 정보 placeholder */}
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex'>
          <div className='h-8 w-48 rounded bg-gray-300'></div>
          <div className='ml-4 h-6 w-24 rounded bg-gray-300'></div>
        </div>
        <div className='h-8 w-8 rounded-full bg-gray-300'></div>
      </div>

      {/* 별점 placeholder */}
      <div className='mb-4 h-6 w-32 rounded bg-gray-300'></div>

      {/* 상품 설명 placeholder */}
      <div className='mb-4 h-4 w-full rounded bg-gray-300'></div>
      <div className='mb-4 h-4 w-3/4 rounded bg-gray-300'></div>

      {/* 가격 정보 placeholder */}
      <div className='mb-4 space-y-2'>
        <div className='h-8 w-full rounded bg-gray-300'></div>
        <div className='h-8 w-full rounded bg-gray-300'></div>
      </div>
    </div>

    {/* 상세 이미지 placeholder */}
    <div className='mb-3 bg-white p-4'>
      <div className='h-64 w-full rounded bg-gray-300'></div>
    </div>

    {/* 리뷰 섹션 placeholder */}
    <div className='mb-3 bg-white p-4'>
      <div className='mb-4 h-8 w-32 rounded bg-gray-300'></div>
      <div className='space-y-2'>
        <div className='h-20 w-full rounded bg-gray-300'></div>
        <div className='h-20 w-full rounded bg-gray-300'></div>
        <div className='h-20 w-full rounded bg-gray-300'></div>
      </div>
    </div>

    {/* 고시 정보 placeholder */}
    <div className='mb-3 bg-white p-4'>
      <div className='mb-2 h-6 w-24 rounded bg-gray-300'></div>
      <div className='flex gap-2'>
        <div className='h-12 flex-1 rounded bg-gray-300'></div>
        <div className='h-12 flex-1 rounded bg-gray-300'></div>
        <div className='h-12 flex-1 rounded bg-gray-300'></div>
      </div>
    </div>

    {/* 구매 버튼 placeholder */}
    <div className='fixed bottom-0 left-0 right-0 bg-white p-2'>
      <div className='h-12 w-full rounded bg-gray-300'></div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
