import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerInfo, useCustomerProductsQuery } from "../../apis";

import { IoMdBusiness, IoMdCall, IoMdHome } from "react-icons/io";
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
      <div className='card mb-4 bg-base-100 shadow-sm'>
        <div className='p-4'>
          <h2 className='card-title justify-center text-2xl font-bold'>{sellerInfo.storeName}</h2>
          <p className='text-center text-xl'>{sellerInfo.customerName}</p>
          <div className='divider my-0'></div>
          <div className='space-y-1'>
            <div className='flex items-center justify-center'>
              <IoMdBusiness className='mr-2' />
              <span>사업자번호 {sellerInfo.storeBusinessNumber}</span>
            </div>
            <div className='flex items-center justify-center'>
              <IoMdHome className='mr-2' />
              <span>{sellerInfo.storeAddress}</span>
            </div>
            <div className='flex items-center justify-center'>
              <IoMdCall className='mr-2' />
              <span>{sellerInfo.storePhoneNumber}</span>
            </div>
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
