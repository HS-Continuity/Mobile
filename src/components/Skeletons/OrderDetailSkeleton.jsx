const OrderDetailSkeleton = () => (
  <div className='container mx-auto max-w-2xl animate-pulse p-4 pb-12'>
    {/* 주문 번호 및 날짜 */}
    <div className='mb-2 rounded-lg border p-4'>
      <div className='flex justify-between'>
        <div className='h-6 w-24 rounded bg-gray-300'></div>
        <div className='h-6 w-32 rounded bg-gray-300'></div>
      </div>
      <div className='mt-2 flex items-center justify-between'>
        <div className='h-6 w-32 rounded bg-gray-300'></div>
        <div className='h-6 w-20 rounded bg-gray-300'></div>
      </div>
    </div>

    {/* 배송 정보 */}
    <div className='rounded-lg border p-4'>
      <div className='mb-2 h-8 w-32 rounded bg-gray-300'></div>
      <hr className='mb-3 border-gray-200' />
      <div className='space-y-2'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='flex'>
            <div className='mr-2 h-6 w-24 rounded bg-gray-300'></div>
            <div className='h-6 w-48 rounded bg-gray-300'></div>
          </div>
        ))}
      </div>
    </div>

    {/* 주문 상품 */}
    <div className='mb-2 mt-2 space-y-4 rounded-lg border p-4'>
      <div className='h-8 w-32 rounded bg-gray-300'></div>
      {[...Array(2)].map((_, index) => (
        <div key={index} className='flex items-start pt-4'>
          <div className='h-20 w-20 rounded bg-gray-300'></div>
          <div className='ml-3 flex-grow'>
            <div className='mb-2 h-6 w-3/4 rounded bg-gray-300'></div>
            <div className='h-4 w-1/2 rounded bg-gray-300'></div>
          </div>
          <div className='h-6 w-16 rounded bg-gray-300'></div>
        </div>
      ))}
    </div>

    {/* 결제 정보 */}
    <div className='mb-8 rounded-lg border p-4 shadow-sm'>
      <div className='mb-4 h-8 w-32 rounded bg-gray-300'></div>
      <div className='space-y-2'>
        {[...Array(3)].map((_, index) => (
          <div key={index} className='flex justify-between'>
            <div className='h-6 w-24 rounded bg-gray-300'></div>
            <div className='h-6 w-32 rounded bg-gray-300'></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default OrderDetailSkeleton;
