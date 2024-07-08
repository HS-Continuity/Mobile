import React from "react";
import Skeleton from "./Skeleton";

const ProductSkeleton = () => {
  return (
    <>
      <div className='card bg-base-100 shadow-xl'>
        <Skeleton className='h-48 w-full' />
        <div className='card-body p-4'>
          <div className='flex'>
            <Skeleton className='mr-2 h-5 w-16' />
            <Skeleton className='h-5 w-32' />
          </div>
          <Skeleton className='mt-2 h-4 w-full' />
          <div className='mt-4 flex items-center justify-between'>
            <div>
              <Skeleton className='h-5 w-24' />
            </div>
            <Skeleton className='h-8 w-8 rounded-full' />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSkeleton;
