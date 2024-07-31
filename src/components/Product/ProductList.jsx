import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ProductItem from "./ProductItem";
import ProductSkeleton from "../Skeletons/ProductSkeleton";
import FetchAllSkeleton from "../Skeletons/FetchAllSkeleton";
import FetchingNextSkeleton from "../Skeletons/FetchingNextSkeleton";
import { fallbackProducts } from "./FallbackProduct";

// 가짜 기본 데이터

const ProductList = ({ useQueryHook, additionalProps = {}, gridCols = 1 }) => {
  const observerTarget = useRef(null);
  const queryClient = useQueryClient();
  const [isServiceDown, setIsServiceDown] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useQueryHook(additionalProps);

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
        <div className='py-4 text-center'>
          <p className='text-gray-600'>일시적으로 최신 상품 정보를 불러올 수 없습니다.</p>
          <p className='mt-1 text-sm text-gray-500'>
            아래 표시된 상품은 이전에 인기 있었던 상품들입니다.
          </p>
          <p className='text-sm text-gray-500'>실시간 값과 차이가 있을 수 있습니다.</p>
          <button
            onClick={handleRefresh}
            className='btn btn-sm mt-1 rounded bg-transparent transition-colors hover:bg-white'>
            새로고침
          </button>
        </div>
      )}

      <div className={`grid grid-cols-${gridCols} gap-2`}>
        {displayProducts.map((product, index) => (
          <ProductItem key={`${product.productId || "unknown"}-${index}`} product={product} />
        ))}
      </div>

      {!isServiceDown && !isError && (
        <>
          {isFetchingNextPage && <FetchingNextSkeleton />}
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
