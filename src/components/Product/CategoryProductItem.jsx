import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { useState } from "react";
import { FaLeaf } from "react-icons/fa";

const CategoryProductItem = ({ productInfo, isServiceDown }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // 이미지 에러 핸들러
  const handleImageError = () => {
    setImgError(true);
  };

  // 샵 네비게이터 핸들러
  const handleShopNavigator = e => {
    if (!isServiceDown) {
      e.stopPropagation();
      navigate(`/shop/${productInfo.customerId}`);
    }
  };

  // 상품 상세 페이지 네비게이터 핸들러
  const handleProductNavigator = () => {
    if (!isServiceDown) {
      navigate(`/product/${productInfo.productId}`);
    }
  };

  return (
    <div className='mb-2 cursor-pointer bg-base-100' onClick={handleProductNavigator}>
      <figure className='relative'>
        {/* 상품 이미지 */}
        {!imgError ? (
          <div className='relative'>
            <img
              src={productInfo.productImage}
              alt={productInfo.productName}
              className={`h-60 w-full object-cover ${productInfo.soldOut ? "grayscale" : ""}`}
              onError={handleImageError}
            />
            {productInfo.soldOut && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <span className='text-2xl font-bold text-red-500'>품절</span>
              </div>
            )}
          </div>
        ) : (
          <div className='flex h-60 w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-4'>
            <div className='text-center'>
              <FaLeaf className='mx-auto mb-2 text-4xl text-green-500' />
              <h3 className='break-words text-2xl font-semibold text-green-700'>
                {productInfo.productName}
              </h3>
            </div>
            {productInfo.soldOut && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <span className='text-2xl font-bold text-red-500'>품절</span>
              </div>
            )}
          </div>
        )}
      </figure>
      <div className=''>
        {/* 배송 유형 표시 (일반, 정기) */}
        <div className='mt-[6px] flex'>
          <div className='w-[58px] bg-[#f4a258] bg-gradient-shine px-2 py-1 text-xs font-semibold text-white'>
            일반배송
          </div>
          {productInfo.isRegularSale === "ACTIVE" && (
            <div className='ml-1 w-[58px] bg-[#708c69] bg-gradient-shine px-2 py-1 text-xs font-semibold text-white'>
              정기배송
            </div>
          )}
        </div>

        {/* 판매자 이름 및 상품명 */}
        <div className='mt-2 flex'>
          <h1
            onClick={handleShopNavigator}
            className={`card-title mb-1 text-base font-extrabold text-green-700 ${isServiceDown ? "" : "cursor-pointer"}`}>
            {productInfo.storeName}
          </h1>
          <h2 className='text-md ml-2 font-normal text-gray-700'>{productInfo.productName}</h2>
        </div>

        {/* 상품 가격 정보 (할인율, 할인된 가격, 원래 가격) */}
        <div className='-mt-1 flex items-center justify-between'>
          <div>
            <span className='text-xs font-medium text-gray-400 line-through'>
              {productInfo.productPrice.toLocaleString()}원
            </span>
            <div className='-mt-1'>
              {productInfo.baseDiscountRate > 0 && (
                <span className='text-lg font-normal text-red-500'>
                  {productInfo.baseDiscountRate}%{" "}
                </span>
              )}
              <span className='text-lg font-bold'>
                {productInfo.calculatedBasePrice.toLocaleString()}원{" "}
              </span>
            </div>

            {/* 별점 평균 */}
            <div className='flex text-sm'>
              <StarRating rating={productInfo.averageScore} count={productInfo.reviewCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductItem;
