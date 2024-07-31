import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ProductSkeleton from "../../components/Skeletons/ProductSkeleton";
import TimeSaleItem from "./timeSaleItem";
import FetchAllSkeleton from "../../components/Skeletons/FetchAllSkeleton";
import FetchingNextSkeleton from "../../components/Skeletons/FetchingNextSkeleton";

const TimesaleList = ({ useQueryHook, additionalProps = {}, gridCols = 1 }) => {
  const observerTarget = useRef(null);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch: originalRefetch,
  } = useQueryHook(additionalProps);

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

  const refetch = useCallback(async () => {
    // 쿼리 데이터 초기화
    await queryClient.resetQueries({ queryKey: useQueryHook.queryKey });
    // 데이터 다시 가져오기
    await originalRefetch();
  }, [queryClient, originalRefetch, useQueryHook.queryKey]);

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

  if (isError || !data || data.pages.length === 0) {
    return (
      <div className='container mx-auto p-4 text-center'>
        <p className='text-lg font-semibold'>검색 결과가 없습니다.</p>
        {error instanceof Error && <p>{error.message}</p>}
      </div>
    );
  }

  const products = data.pages.flatMap(page => page.content) || [];

  return (
    <div className='container mx-auto p-4'>
      <div className={`grid grid-cols-${gridCols} gap-4`}>
        {products.map((product, index) => (
          <TimeSaleItem product={product} key={index} />
        ))}
      </div>

      {isFetchingNextPage && <FetchingNextSkeleton />}

      {!hasNextPage && products.length > 0 && (
        <FetchAllSkeleton name={"상품을"} refetch={refetch} />
      )}

      {hasNextPage && <div ref={observerTarget} className='h-10' />}
    </div>
  );
};

export default TimesaleList;
