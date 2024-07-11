// import { FaHeart } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";

const ProductItem = ({ product }) => {
  const navigate = useNavigate();
  const discountRate = product.base_discount_rate || 0;

  const productPrice = product.product_price || 0;
  const discountedPrice = productPrice * (1 - discountRate / 100);

  const handleShopNavigator = e => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shop/${product.customer_id}`);
  };

  const handleCartClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link to={`/product/${product.id}`} className='card bg-base-100 shadow-xl'>
      <figure>
        <img
          src={product.product_image}
          alt={product.product_name}
          className='h-48 w-full object-cover'
        />
      </figure>
      <div className='card-body p-4'>
        <div className='flex'>
          <h1
            onClick={handleShopNavigator}
            className='card-title mr-2 cursor-pointer text-sm text-green-700 hover:underline'>
            {product.customer_id}
          </h1>
          <h2 className='card-title ml-2 text-sm'>{product.product_name}</h2>
          {!product.is_regular_sale && (
            <span className='ml-2 rounded-full bg-[#00835F] px-2 py-1 text-xs text-white'>
              정기배송
            </span>
          )}
        </div>
        <p className='text-xs text-gray-500'>{product.product_description}</p>
        <div className='flex items-center justify-between'>
          <div>
            {discountRate > 0 && <span className='font-bold text-red-500'>{discountRate}% </span>}
            <span className='font-bold'>{discountedPrice.toLocaleString()}원 </span>
            <span className='font-bold text-gray-400 line-through'>
              {productPrice.toLocaleString()}원
            </span>
          </div>
          {/* <button className='btn btn-circle btn-sm' onClick={handleCartClick}>
            <CiShoppingCart className='text-2xl text-black' />
          </button> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
