import { FaHeart } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  const discountRate = Math.max(
    product.base_discount_rate || 0,
    product.regular_discount_rate || 0,
    product.personalize_discount_rate || 0
  );

  const productPrice = product.product_price || 0;
  const discountedPrice = productPrice * (1 - discountRate / 100);

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
          <h2 className='card-title mr-2 text-sm text-green-700'>{product.customer_id}</h2>
          <h2 className='card-title text-sm'>{product.product_name}</h2>
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
          <button className='btn btn-circle btn-sm' onClick={e => e.preventDefault()}>
            <CiShoppingCart className='text-2xl text-black' />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
