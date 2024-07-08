import Skeleton from "./Skeleton";

const CartSkeleton = () => {
  return (
    <>
      <div className='mb-4 flex rounded-lg bg-white p-4 shadow'>
        <Skeleton className='mr-4 h-20 w-20 rounded' />
        <div className='flex-grow'>
          <Skeleton className='mb-2 h-6 w-3/4' />
          <Skeleton className='mb-2 h-4 w-1/2' />
          <div className='flex justify-between'>
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-8 w-24' />
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSkeleton;
