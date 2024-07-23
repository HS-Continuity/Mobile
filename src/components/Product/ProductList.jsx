import { useCallback, useEffect, useRef } from "react";
import ProductItem from "./ProductItem";
import { IoIosRefresh } from "react-icons/io";
import ProductSkeleton from "../Skeletons/ProductSkeleton";

const ProductList = ({ useQueryHook, additionalProps = {}, gridCols = 1 }) => {
  const observerTarget = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useQueryHook(additionalProps);

  const handleObserver = useCallback(
    entries => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className='container mx-auto p-4'>
        <div className={`grid grid-cols-${gridCols} gap-4`}>
          {[...Array(10)].map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} gridCols={gridCols} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || error || !data || data.length === 0 || data?.pages[0]?.content?.length === 0) {
    return (
      <div className='container mx-auto p-4 text-center'>
        <p className='text-lg font-semibold'>검색 결과가 없습니다.</p>
      </div>
    );
  }

  const products = data?.pages.flatMap(page => page.content) || [];

  return (
    <div className='container mx-auto p-1'>
      <div className={`grid grid-cols-${gridCols} gap-4`}>
        {products.map((product, index) => (
          <ProductItem key={`${product.productId || "unknown"}-${index}`} product={product} />
        ))}
      </div>
      {isFetchingNextPage && <div className='mt-4 text-center'>더 많은 상품 가져오는중..</div>}
      {!hasNextPage && products.length > 0 && (
        <div className='mt-7 text-center'>
          <p className='mb-2 text-gray-600'>모든 상품을 불러왔습니다.</p>
          <IoIosRefresh
            className='mx-auto cursor-pointer text-xl'
            onClick={() => window.location.reload()}
          />
        </div>
      )}
      {hasNextPage && <div ref={observerTarget} className='h-10' />}
    </div>
  );
};

export default ProductList;
