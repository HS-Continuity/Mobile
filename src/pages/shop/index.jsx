import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerInfo, useCustomerProductsQuery } from "../../apis";
import ProductItem from "../../components/Product/ProductItem";
import { IoIosRefresh } from "react-icons/io";

const Shop = () => {
  const observerTarget = useRef(null);
  const { customerId } = useParams();

  const { data: sellerInfo, isLoading: isLoadingSellerInfo } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => fetchCustomerInfo(customerId),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingProducts,
  } = useCustomerProductsQuery(customerId);

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

  if (isLoadingSellerInfo || isLoadingProducts) {
    return <div>Loading...</div>;
  }

  const products = data?.pages.flatMap(page => page.content) || [];

  return (
    <div className='mx-auto flex min-h-screen max-w-md flex-col bg-white'>
      <main className='flex-grow'>
        {/* 판매자 정보 */}
        <div className='mb-6'>
          <h2 className='mb-2 text-center text-2xl font-bold'>{sellerInfo.storeName}</h2>
          <h2 className='mb-2 text-center text-2xl'>{sellerInfo.customerName}</h2>
          <h3 className='mb-2 text-center text-lg'>사업자번호 {sellerInfo.storeBusinessNumber}</h3>
          <h3 className='mb-2 text-center text-lg'>{sellerInfo.storeAddress}</h3>
          <h3 className='mb-2 text-center text-lg'>{sellerInfo.storePhoneNumber}</h3>
        </div>

        {/* 판매자 사진 */}
        <div className='mb-6 rounded-lg bg-gray-100 p-4'>
          <img
            src={sellerInfo.storeImage}
            alt={sellerInfo.customerName}
            className='h-40 w-full rounded object-contain'
          />
        </div>

        {/* 상품 목록 */}
        <div className='container mx-auto'>
          <div className='grid grid-cols-2 gap-4'>
            {products.map(product => (
              <ProductItem key={product.productId} product={product} />
            ))}
          </div>
          {isFetchingNextPage && <div className='mt-4 text-center'>더 많은 상품 가져오는중..</div>}
          {!hasNextPage && products.length > 0 && (
            <div className='mt-7 cursor-pointer text-center'>
              <IoIosRefresh className='mx-auto text-xl' onClick={() => window.location.reload()} />
            </div>
          )}
          {hasNextPage && <div ref={observerTarget} className='h-10' />}
        </div>
      </main>
    </div>
  );
};

export default Shop;
