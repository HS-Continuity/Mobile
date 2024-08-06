const SkeletonCard = () => (
  <div className='card animate-pulse bg-base-100'>
    <div className='card-body rounded-2xl border border-gray-200 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='h-10 w-10 rounded-full bg-gray-300'></div>
          <div>
            <div className='h-4 w-24 rounded bg-gray-300'></div>
            <div className='mt-2 h-3 w-32 rounded bg-gray-300'></div>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <div className='h-6 w-24 rounded bg-gray-300'></div>
          <div className='h-6 w-6 rounded-full bg-gray-300'></div>
        </div>
      </div>
    </div>
  </div>
);

const PaymentSkeleton = () => (
  <div className='container mx-auto p-4'>
    <div className='mb-6 h-6 w-32 rounded bg-gray-300'></div>
    <div className='space-y-4'>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <div className='mt-6 h-12 w-full rounded bg-gray-300'></div>
  </div>
);

export default PaymentSkeleton;
