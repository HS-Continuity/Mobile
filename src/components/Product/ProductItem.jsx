import { Link, useNavigate } from "react-router-dom";

const ProductItem = ({ product }) => {
  const navigate = useNavigate();

  const handleShopNavigator = e => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shop/${product.customerId}`);
  };

  return (
    <Link to={`/product/${product.productId}`} className='card bg-base-100 shadow-xl'>
      <figure>
        <img
          src={product.productImage}
          alt={product.productName}
          className='h-48 w-full object-cover'
        />
      </figure>
      <div className='card-body p-4'>
        <div className='flex'>
          <h1
            onClick={handleShopNavigator}
            className='card-title mr-2 cursor-pointer text-sm text-green-700 hover:underline'>
            {product.customerId}
          </h1>
          <h2 className='card-title ml-2 text-sm'>{product.productName}</h2>
          {!product.isRegularSale == "T" && (
            <span className='ml-2 rounded-full bg-[#00835F] px-2 py-1 text-xs text-white'>
              정기배송
            </span>
          )}
        </div>
        <p className='text-xs text-gray-500'>{product.productDescription}</p>
        <div className='flex items-center justify-between'>
          <div>
            {product.baseDiscountRate > 0 && (
              <span className='font-bold text-red-500'>{product.baseDiscountRate}% </span>
            )}
            <span className='font-bold'>{product.calculatedBasePrice.toLocaleString()}원 </span>
            <span className='font-bold text-gray-400 line-through'>
              {product.productPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
