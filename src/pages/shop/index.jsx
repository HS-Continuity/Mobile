import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerInfo, useCustomerProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";
import ShopSkeleton from "../../components/Skeletons/ShopSkeleton";
import { ShopError } from "../../components/Errors/ErrorDisplay";

const Shop = () => {
  const { customerId } = useParams();

  const {
    data: sellerInfo,
    isLoading: isLoadingSellerInfo,
    isError: isErrorSellerInfo,
  } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => fetchCustomerInfo(customerId),
  });

  if (isLoadingSellerInfo) {
    return <ShopSkeleton />;
  }

  if (isErrorSellerInfo) {
    return <ShopError />;
  }

  // 이니셜을 생성하는 함수

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* 판매자 사진 또는 이니셜 */}
      <div className='mb-8'>
        <div className='mx-auto h-40 w-full overflow-hidden'>
          {sellerInfo.storeImage ? (
            <img
              src={sellerInfo.storeImage}
              alt={sellerInfo.customerName}
              onError={e => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`text-shadow-md flex h-full w-full items-center justify-center bg-gradient-shine text-3xl font-bold text-white ${
              sellerInfo.storeImage ? "hidden" : ""
            }`}
            style={{ backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16) }}>
            {sellerInfo.customerName}
          </div>
        </div>
      </div>

      {/* 판매자 정보 */}
      <div className='mb-8 rounded-lg border bg-white p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>판매자 정보</h2>
        </div>
        <hr className='mb-3 border-gray-200' />
        <div className='space-y-1'>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>상호명</span>
            <span>{sellerInfo.storeName}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>대표자명</span>
            <span>{sellerInfo.customerName}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>사업자번호</span>
            <span>{sellerInfo.storeBusinessNumber}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>주소</span>
            <span>{sellerInfo.storeAddress}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>전화번호</span>
            <span>{sellerInfo.storePhoneNumber}</span>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <ProductList
        useQueryHook={useCustomerProductsQuery}
        additionalProps={customerId}
        gridCols={2}
      />
    </div>
  );
};

export default Shop;
