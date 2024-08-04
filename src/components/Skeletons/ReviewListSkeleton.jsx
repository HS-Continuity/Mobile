import Skeleton from "./Skeleton";

const ReviewBoxSkeleton = () => {
  return (
    <div className='mb-4 rounded-lg border p-4'>
      <div className='mb-2 flex items-center'>
        <div className='flex'>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className='mr-1 h-4 w-4' />
          ))}
        </div>
        <Skeleton className='ml-2 h-4 w-20 rounded' />
        <Skeleton className='ml-2 h-4 w-24 rounded' />
      </div>
      <Skeleton className='mb-2 h-4 w-32 rounded' />
      <Skeleton className='h-16 w-full rounded' />
    </div>
  );
};

export default ReviewBoxSkeleton;
