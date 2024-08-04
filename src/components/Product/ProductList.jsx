import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ProductItem from "./ProductItem";
import ProductSkeleton from "../Skeletons/ProductSkeleton";
import FetchAllSkeleton from "../Skeletons/FetchAllSkeleton";
import FetchingNextSkeleton from "../Skeletons/FetchingNextSkeleton";
import { fallbackProducts } from "./FallbackProduct";
import { ProductError } from "../Errors/ErrorDisplay";

// 가짜 기본 데이터

const ProductList = ({ useQueryHook, additionalProps = {}, gridCols = 1 }) => {
  const observerTarget = useRef(null);
  const queryClient = useQueryClient();
  const [isServiceDown, setIsServiceDown] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useQueryHook(additionalProps);

  const handleObserver = useCallback(
    entries => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isServiceDown) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isServiceDown]
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

  const handleRefresh = useCallback(async () => {
    setIsServiceDown(false);
    await queryClient.invalidateQueries(useQueryHook.getKey(additionalProps));
    refetch();
  }, [queryClient, refetch, useQueryHook, additionalProps]);

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

  const products = data?.pages?.flatMap(page => page.content) || [];

  // 서비스 다운 또는 에러 상태일 때 가짜 데이터 사용
  const displayProducts =
    isServiceDown || isError || products.length === 0 ? fallbackProducts : products;

  return (
    <div className='container mx-auto p-4'>
      {(isServiceDown || isError) && (
        <ProductError isServiceDown={isServiceDown} isError={isError} />
      )}

      <div className={`grid grid-cols-${gridCols} gap-2`}>
        {displayProducts.map((product, index) => (
          <ProductItem
            key={`${product.productId || "unknown"}-${index}`}
            product={product}
            isServiceDown={isServiceDown || isError}
          />
        ))}
      </div>

      {!isServiceDown && !isError && (
        <>
          {isFetchingNextPage && <FetchingNextSkeleton message={"상품"} />}
          {!hasNextPage && products.length > 0 && (
            <FetchAllSkeleton name={"상품을"} refetch={handleRefresh} />
          )}
          {hasNextPage && <div ref={observerTarget} className='h-10' />}
        </>
      )}
    </div>
  );
};
export default ProductList;
