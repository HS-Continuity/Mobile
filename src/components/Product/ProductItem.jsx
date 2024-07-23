import { Link, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const ProductItem = ({ product }) => {
  const navigate = useNavigate();

  const handleShopNavigator = e => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shop/${product.customerId}`);
  };

  return (
    <Link to={`/product/${product.productId}`} className='card bg-base-100 shadow-sm'>
      <figure className='relative'>
        <img
          src={product.productImage}
          alt={product.productName}
          className='h-48 w-full object-cover'
        />
      </figure>
      <div className='card-body p-4'>
        <div className='flex'>
          <div className='w-[64px] bg-[#f4a258] px-2 py-1 text-xs font-semibold text-white'>
            일반배송
          </div>
          {product.isRegularSale === "ACTIVE" && (
            <div className='ml-1 w-[64px] bg-[#708c69] px-2 py-1 text-xs font-semibold text-white'>
              정기배송
            </div>
          )}
        </div>

        <div className='flex'>
          <h1
            onClick={handleShopNavigator}
            className='card-title mb-1 cursor-pointer text-sm text-green-700 underline underline-offset-2'>
            {product.customerId}
          </h1>
          <h2 className='ml-1 text-sm font-bold text-gray-700'>{product.productName}</h2>
        </div>
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
