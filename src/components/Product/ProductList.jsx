import { useCallback, useEffect, useRef } from "react";
import { IoIosRefresh } from "react-icons/io";

import ProductItem from "./ProductItem";
import ProductSkeleton from "../Skeletons/ProductSkeleton";

const ProductList = ({ useQueryHook, additionalProps = {}, gridCols = 1 }) => {
  const observerTarget = useRef(null);

  // 상품 데이터를 가져오는 쿼리 훅
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useQueryHook(additionalProps);

  // Intersection Observer 콜백 함수
  const handleObserver = useCallback(
    entries => {
      const [target] = entries; // 첫 번째 entry 가져오기
      // 타겟이 화면에 보이고 다음 페이지가 존재하면 fetchNextPage 함수 호출
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  // Intersection Observer 초기화
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1, // 10% 이상 보일 때 콜백 실행
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
      {/* 상품 목록 그리드 레이아웃 */}
      <div className={`grid grid-cols-${gridCols} gap-4`}>
        {products.map((product, index) => (
          <ProductItem key={`${product.productId || "unknown"}-${index}`} product={product} />
        ))}
      </div>

      {/* 다음 페이지 로딩 중 메시지 */}
      {isFetchingNextPage && <div className='mt-4 text-center'>더 많은 상품 가져오는중..</div>}

      {/* 모든 상품 로딩 완료 메시지 및 새로고침 버튼 */}
      {!hasNextPage && products.length > 0 && (
        <div className='mt-7 text-center'>
          <p className='mb-2 text-gray-600'>모든 상품을 불러왔습니다.</p>
          <IoIosRefresh
            className='mx-auto cursor-pointer text-xl'
            onClick={() => window.location.reload()}
          />
        </div>
      )}

      {/* Intersection Observer 타겟 요소 */}
      {hasNextPage && <div ref={observerTarget} className='h-10' />}
    </div>
  );
};

export default ProductList;
