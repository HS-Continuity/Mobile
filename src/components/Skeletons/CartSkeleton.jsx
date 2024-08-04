const CartSkeletonItem = () => (
  <div className='flex animate-pulse items-start space-x-4 border-b p-4'>
    <div className='h-6 w-6 rounded bg-slate-200'></div>
    <div className='h-20 w-20 flex-shrink-0 rounded bg-slate-200'></div>
    <div className='flex-1 space-y-4 py-1'>
      <div className='h-4 w-3/4 rounded bg-slate-200'></div>
      <div className='space-y-2'>
        <div className='h-4 rounded bg-slate-200'></div>
        <div className='h-4 w-5/6 rounded bg-slate-200'></div>
      </div>
    </div>
  </div>
);

const CartSkeleton = () => {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow'>
      <div className='space-y-4 p-4'>
        <div className='flex animate-pulse space-x-4'>
          <div className='flex-1 space-y-4 py-1'>
            <div className='h-4 w-3/4 rounded bg-slate-200'></div>
            <div className='h-4 w-1/2 rounded bg-slate-200'></div>
          </div>
        </div>
        {[...Array(3)].map((_, index) => (
          <CartSkeletonItem key={index} />
        ))}
      </div>
      <div className='border-t p-4'>
        <div className='flex animate-pulse items-center justify-between'>
          <div className='h-6 w-1/4 rounded bg-slate-200'></div>
          <div className='h-6 w-1/4 rounded bg-slate-200'></div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
