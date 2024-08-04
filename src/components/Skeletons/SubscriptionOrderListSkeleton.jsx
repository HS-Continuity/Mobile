const SubscriptionOrderItemSkeleton = () => (
  <div className='animate-pulse rounded-lg border border-gray-200 bg-white p-4'>
    <div className='mb-1 flex items-center justify-between'>
      <div className='flex items-center'>
        <div className='h-6 w-24 rounded bg-gray-200'></div>
        <div className='ml-2 h-4 w-16 rounded bg-gray-200'></div>
      </div>
      <div className='h-6 w-16 rounded bg-gray-200'></div>
    </div>
    <div className='flex items-start space-x-4'>
      <div className='h-20 w-20 rounded bg-gray-200'></div>
      <div className='flex-grow'>
        <div className='mb-1 h-4 w-20 rounded bg-gray-200'></div>
        <div className='mb-1 h-5 w-32 rounded bg-gray-200'></div>
        <div className='h-4 w-24 rounded bg-gray-200'></div>
      </div>
    </div>
  </div>
);

const SubscriptionOrderListSkeleton = () => (
  <div className='space-y-3'>
    {[...Array(5)].map((_, index) => (
      <SubscriptionOrderItemSkeleton key={index} />
    ))}
  </div>
);

export default SubscriptionOrderListSkeleton;
