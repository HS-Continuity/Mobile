import { Link, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { useState } from "react";
import { FaLeaf } from "react-icons/fa";

const ProductItem = ({ product }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Detail 페이지로 이동
  const handleShopNavigator = e => {
    e.preventDefault();
    e.stopPropagation(); // 상위 요소로의 이벤트 전파 방지
    navigate(`/shop/${product.customerId}`);
  };

  // 이미지 에러 핸들러
  const handleImageError = () => {
    setImgError(true);
  };

  return (
    // 상품 상세 페이지 링크
    <Link to={`/product/${product.productId}`} className='bg-base-100'>
      <figure className='relative'>
        {/* 상품 이미지 */}
        {!imgError ? (
          <div className='relative'>
            <img
              src={product.productImage}
              alt={product.productName}
              className={`h-56 w-full object-cover ${product.soldOut ? "grayscale" : ""}`}
              onError={handleImageError}
            />
            {product.soldOut && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <span className='text-2xl font-bold text-red-500'>품절</span>
              </div>
            )}
          </div>
        ) : (
          <div className='flex h-56 w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-4'>
            <div className='text-center'>
              <FaLeaf className='mx-auto mb-2 text-4xl text-green-500' />
              <h3 className='break-words text-2xl font-semibold text-green-700'>
                {product.productName}
              </h3>
            </div>
            {product.soldOut && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <span className='text-2xl font-bold text-red-500'>품절</span>
              </div>
            )}
          </div>
        )}
      </figure>
      <div className='card-body p-4'>
        {/* 배송 유형 표시 (일반, 정기) */}
        <div className='-mt-2 flex'>
          <div className='w-[58px] bg-[#f4a258] bg-gradient-shine px-2 py-1 text-xs font-semibold text-white'>
            일반배송
          </div>
          {product.isRegularSale === "ACTIVE" && (
            <div className='ml-1 w-[58px] bg-[#708c69] bg-gradient-shine px-2 py-1 text-xs font-semibold text-white'>
              정기배송
            </div>
          )}
        </div>

        {/* 판매자 이름 및 상품명 */}
        <div className='flex'>
          <h1
            onClick={handleShopNavigator}
            className='card-title mb-1 cursor-pointer text-sm text-green-700 underline underline-offset-2'>
            {product.customerId}
          </h1>
          <h2 className='ml-1 text-sm font-bold text-gray-700'>{product.productName}</h2>
        </div>

        {/* 상품 가격 정보 (할인율, 할인된 가격, 원래 가격) */}
        <div className='flex items-center justify-between'>
          <div>
            {product.baseDiscountRate > 0 && (
              <span className='text-lg font-extrabold text-red-500'>
                {product.baseDiscountRate}%{" "}
              </span>
            )}
            <span className='text-lg font-extrabold'>
              {product.calculatedBasePrice.toLocaleString()}원{" "}
            </span>
            <span className='text-sm font-semibold text-gray-400 line-through'>
              {product.productPrice.toLocaleString()}원
            </span>

            {/* 별점 평균 */}
            <div className='mt-2 flex'>
              <StarRating rating={product.averageScore} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
