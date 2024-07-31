const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`}></div>
);

const OrderSkeleton = () => {
  return (
    <div className='noScrollbar flex h-screen flex-col bg-gray-50 pb-14'>
      <div className='noScrollbar flex-1 space-y-4 overflow-auto p-4'>
        {/* 주문 아이템 Skeleton */}
        <div className='bg-white p-4'>
          <SkeletonBox className='mb-4 h-6 w-1/4' />
          <div className='space-y-4'>
            {[...Array(2)].map((_, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <SkeletonBox className='h-12 w-12 rounded' />
                <div className='flex-1'>
                  <SkeletonBox className='mb-2 h-4 w-3/4' />
                  <SkeletonBox className='h-3 w-1/2' />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 배송 주기 Skeleton */}
        <div className='bg-white p-4'>
          <SkeletonBox className='mb-4 h-6 w-1/3' />
          <div className='grid grid-cols-2 gap-4'>
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <SkeletonBox className='mb-2 h-4 w-1/2' />
                <SkeletonBox className='h-3 w-3/4' />
              </div>
            ))}
          </div>
        </div>

        {/* 구매자 정보 Skeleton */}
        <div className='bg-white p-4'>
          <SkeletonBox className='mb-4 h-6 w-1/3' />
          <div className='grid grid-cols-2 gap-4'>
            {[...Array(2)].map((_, index) => (
              <div key={index}>
                <SkeletonBox className='mb-2 h-4 w-1/2' />
                <SkeletonBox className='h-3 w-3/4' />
              </div>
            ))}
          </div>
        </div>

        {/* 배송 메모 Skeleton */}
        <div className='bg-white p-4'>
          <SkeletonBox className='mb-2 h-6 w-1/4' />
          <SkeletonBox className='h-10 w-full' />
        </div>

        {/* 받는 사람 주소 Skeleton */}
        <div className='bg-white p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <SkeletonBox className='h-6 w-1/3' />
            <SkeletonBox className='h-8 w-16' />
          </div>
          <SkeletonBox className='mb-2 h-4 w-full' />
          <SkeletonBox className='h-4 w-2/3' />
        </div>

        {/* 회원 쿠폰 리스트 Skeleton */}
        <div className='bg-white p-4'>
          <SkeletonBox className='mb-2 h-6 w-1/4' />
          <SkeletonBox className='h-10 w-full' />
        </div>

        {/* 결제 금액 Skeleton */}
        <div className='bg-white p-4'>
          <SkeletonBox className='mb-4 h-6 w-1/4' />
          {[...Array(4)].map((_, index) => (
            <div key={index} className='mb-2 flex items-center justify-between'>
              <SkeletonBox className='h-4 w-1/4' />
              <SkeletonBox className='h-4 w-1/5' />
            </div>
          ))}
          <div className='mt-4 flex items-center justify-between'>
            <SkeletonBox className='h-5 w-1/3' />
            <SkeletonBox className='h-5 w-1/4' />
          </div>
        </div>

        {/* 결제 수단 Skeleton */}
        <div className='bg-white p-4'>
          <SkeletonBox className='mb-4 h-6 w-1/4' />
          <div className='relative w-full' style={{ height: "220px" }}>
            <SkeletonBox className='absolute inset-0 rounded-xl' />
          </div>
        </div>

        {/* 결제 동의 Skeleton */}
        <div className='flex items-center bg-white p-4'>
          <SkeletonBox className='mr-2 h-5 w-5' />
          <SkeletonBox className='h-4 w-3/4' />
        </div>
      </div>

      {/* 결제하기 버튼 Skeleton */}
      <div className='fixed bottom-0 left-0 right-0 bg-white p-4'>
        <SkeletonBox className='h-12 w-full rounded-md' />
      </div>
    </div>
  );
};

export default OrderSkeleton;
