const ShopSkeleton = () => {
  return (
    <div className='container mx-auto animate-pulse px-4 py-8'>
      {/* 판매자 사진 스켈레톤 - 네모 모양, 가운데 정렬 */}
      <div className='mb-8 flex justify-center'>
        <div className='h-40 w-full rounded bg-slate-200'></div>
      </div>

      {/* 판매자 정보 스켈레톤 */}
      <div className='mb-8 rounded-lg border bg-white p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <div className='h-6 w-1/4 rounded bg-slate-200'></div>
        </div>
        <hr className='mb-3 border-gray-200' />
        <div className='space-y-3'>
          {[...Array(5)].map((_, index) => (
            <div key={index} className='flex'>
              <div className='mr-2 h-4 w-24 rounded bg-slate-200'></div>
              <div className='h-4 flex-1 rounded bg-slate-200'></div>
            </div>
          ))}
        </div>
      </div>

      {/* 상품 목록 스켈레톤 */}
      <div className='grid grid-cols-2 gap-4'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='rounded-lg bg-white p-4 shadow'>
            <div className='mb-4 h-40 w-full rounded bg-slate-200'></div>
            <div className='mb-2 h-4 w-3/4 rounded bg-slate-200'></div>
            <div className='h-4 w-1/2 rounded bg-slate-200'></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopSkeleton;
