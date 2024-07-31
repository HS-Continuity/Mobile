import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerInfo, useCustomerProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";

const Shop = () => {
  const { customerId } = useParams();

  const { data: sellerInfo, isLoading: isLoadingSellerInfo } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => fetchCustomerInfo(customerId),
  });

  if (isLoadingSellerInfo) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <span className='loading loading-spinner loading-lg'></span>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* 판매자 사진 */}
      <div className='mb-8'>
        <div className='avatar'>
          <div className='mx-auto h-40 w-40'>
            <img src={sellerInfo.storeImage} alt={sellerInfo.customerName} />
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
