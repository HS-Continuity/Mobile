import Skeleton from "./Skeleton";

const CategorySkeleton = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      {/* 아이콘 */}
      <Skeleton className='mb-2 h-12 w-12 rounded-full' />
      {/* 텍스트 */}
      <Skeleton className='h-4 w-16' />
    </div>
  );
};

export default CategorySkeleton;
