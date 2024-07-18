import { useCallback, useEffect, useRef } from "react";
import ProductItem from "./ProductItem";
// import { useProductsQuery } from "../../apis";
import { IoIosRefresh } from "react-icons/io";
import ProductSkeleton from "../Skeletons/ProductSkeleton";

const DetailProductList = () => {
  // const observerTarget = useRef(null);
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useProductsQuery();

  // const handleObserver = useCallback(
  //   entries => {
  //     const [target] = entries;
  //     if (target.isIntersecting && hasNextPage) {
  //       fetchNextPage();
  //     }
  //   },
  //   [fetchNextPage, hasNextPage]
  // );

  // useEffect(() => {
  //   const observer = new IntersectionObserver(handleObserver, {
  //     root: null,
  //     rootMargin: "20px",
  //     threshold: 0.1,
  //   });

  //   if (observerTarget.current) {
  //     observer.observe(observerTarget.current);
  //   }

  //   return () => {
  //     if (observerTarget.current) {
  //       observer.unobserve(observerTarget.current);
  //     }
  //   };
  // }, [handleObserver]);

  // if (isLoading) {
  //   return (
  //     <div className='container mx-auto p-4'>
  //       <div className='grid grid-cols-2 gap-4'>
  //         {[...Array(2)].map((_, index) => (
  //           <ProductSkeleton key={index} />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  // const products = data?.pages.flat() || [];

  return (
    <div className='container mx-auto p-4'>
      {/* <div className='grid grid-cols-2 gap-4'>
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      {isFetchingNextPage && <div className='mt-4 text-center'>더 많은 상품 가져오는중..</div>}
      {!hasNextPage && products.length > 0 && (
        <div className='mt-7 cursor-pointer text-center'>
          <IoIosRefresh className='mx-auto text-xl' onClick={() => location.reload()} />
        </div>
      )}
      {hasNextPage && <div ref={observerTarget} className='h-10' />} */}
    </div>
  );
};

export default DetailProductList;
