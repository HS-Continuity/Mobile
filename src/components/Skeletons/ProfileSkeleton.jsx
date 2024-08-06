export const SkeletonField = () => (
  <div className='flex animate-pulse items-center space-x-3 rounded-lg bg-gray-100 p-1'>
    <div className='ml-3 h-5 w-5 rounded-full bg-gray-200'></div>
    <div className='flex-1'>
      <div className='h-2 w-24 rounded bg-gray-200'></div>
      <div className='mt-2 h-4 w-32 rounded bg-gray-200'></div>
    </div>
  </div>
);

export const SkeletonPasswordField = () => (
  <div className='flex animate-pulse items-center space-x-4 rounded-lg border border-gray-200 bg-white p-3'>
    <div className='flex min-w-[120px] items-center space-x-3'>
      <div className='h-5 w-5 rounded-full bg-gray-200'></div>
      <div className='h-4 w-20 rounded bg-gray-200'></div>
    </div>
    <div className='flex-1 rounded bg-gray-200 py-2'></div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className='space-y-4'>
    <div className='grid grid-cols-2 gap-4'>
      <SkeletonField />
      <SkeletonField />
    </div>
    <div className='grid grid-cols-2 gap-4'>
      <SkeletonField />
      <SkeletonField />
    </div>
    <div className='grid grid-cols-2 gap-4'>
      <SkeletonField />
      <SkeletonField />
    </div>
    <div className='space-y-2'>
      <SkeletonPasswordField />
      <SkeletonPasswordField />
      <SkeletonPasswordField />
    </div>
  </div>
);
