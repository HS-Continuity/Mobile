import Skeleton from "./Skeleton";

const ProductSkeleton = ({ gridCols = 1 }) => {
  const isMultiColumn = gridCols > 1;

  return (
    <div className={`card bg-base-100 ${isMultiColumn ? "h-full" : ""}`}>
      <Skeleton className={`w-full ${isMultiColumn ? "h-32" : "h-48"}`} />
      <div className='card-body p-4'>
        <div className='flex flex-col'>
          <div className='flex'>
            <Skeleton className='mr-2 h-5 w-16' />
            <Skeleton className='h-5 w-32' />
          </div>
          <Skeleton className='mt-2 h-4 w-full' />
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <div>
            <Skeleton className='h-5 w-24' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
