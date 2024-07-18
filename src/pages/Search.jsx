import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSearchProductsQuery } from "../apis/Product";
import ProductSkeleton from "../components/Skeletons/ProductSkeleton";
import ProductItem from "../components/Product/ProductItem";
import { IoIosRefresh } from "react-icons/io";

const SearchResults = () => {
  const location = useLocation();
  const observerTarget = useRef(null);
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchProductsQuery(keyword);

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
        <div className='grid grid-cols-2 gap-4'>
          {[...Array(2)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) return <div>검색 중...</div>;

  const products = data?.pages.flatMap(page => page.content) || [];

  return (
    <div className=''>
      <h2 className='mb-4 text-2xl font-bold'>{keyword} 검색 결과</h2>
      {data && data.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <div className='container mx-auto'>
          <div className='grid grid-cols-2 gap-4'>
            {products.map(product => (
              <ProductItem key={product.productId} product={product} />
            ))}
          </div>
          {isFetchingNextPage && <div className='mt-4 text-center'>더 많은 상품 가져오는중..</div>}
          {!hasNextPage && !isFetchingNextPage && (
            <div className='mt-7 cursor-pointer text-center'>
              <IoIosRefresh className='mx-auto text-xl' onClick={() => window.location.reload()} />
            </div>
          )}
          {hasNextPage && <div ref={observerTarget} className='h-10' />}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
