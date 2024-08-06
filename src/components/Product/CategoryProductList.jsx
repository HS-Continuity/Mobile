import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ProductSkeleton from "../Skeletons/ProductSkeleton";
import FetchAllSkeleton from "../Skeletons/FetchAllSkeleton";
import FetchingNextSkeleton from "../Skeletons/FetchingNextSkeleton";
import { fallbackProducts } from "./FallbackProduct";
import { ProductError } from "../Errors/ErrorDisplay";
import CategoryProductItem from "./CategoryProductItem";

const CategoryProductList = ({ useQueryHook, additionalProps = {}, gridCols = 1 }) => {
  const observerTarget = useRef(null);
  const queryClient = useQueryClient();
  const [isServiceDown, setIsServiceDown] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useQueryHook(additionalProps);

  const categoryName =
    data?.pages[0]?.content[0].categoryName || data?.pages[0]?.content[0].detailCategoryName;

  const handleRefresh = useCallback(async () => {
    setIsServiceDown(false);
    await queryClient.invalidateQueries(useQueryHook.getKey(additionalProps));
    refetch();
  }, [queryClient, refetch, useQueryHook, additionalProps]);

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

  const products =
    data?.pages?.flatMap(page => page.content[0]?.searchProductInformationDtoList || []) || [];

  // 서비스 다운 또는 에러 상태일 때 가짜 데이터 사용
  const displayProducts =
    isServiceDown || isError || products.length === 0 ? fallbackProducts : products;

  return (
    <div className='container mx-auto p-4'>
      {(isServiceDown || isError) && (
        <ProductError isServiceDown={isServiceDown} isError={isError} />
      )}

      <div className='mb-8 text-center'>
        <h1 className='relative inline-block px-6 py-3 text-3xl font-bold text-gray-800'>
          <span className='relative z-10'>{categoryName} 카테고리</span>
          <span className='absolute bottom-0 left-0 h-[4px] w-full bg-[#00835F] opacity-70'></span>
        </h1>
      </div>
      <div className={`grid grid-cols-${gridCols} gap-2`}>
        {displayProducts.map((productInfo, index) => (
          <CategoryProductItem
            key={`${productInfo.productId || "unknown"}-${index}`}
            productInfo={productInfo}
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

export default CategoryProductList;
