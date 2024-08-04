import { useState, useCallback } from "react";
import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdvertisementProductItem = ({ product }) => {
  const { productName, price, discountRate, productImage, productId } = product;
  const discountedPrice = price * (1 - discountRate / 100);
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [imgError, setImgError] = useState(false);

  const handleMouseDown = useCallback(e => {
    setIsDragging(false);
    setStartX(e.pageX);
  }, []);

  const handleMouseMove = useCallback(
    e => {
      if (Math.abs(e.pageX - startX) > 5) {
        setIsDragging(true);
      }
    },
    [startX]
  );

  const handleMouseUp = useCallback(
    e => {
      if (!isDragging) {
        navigate(`/product/${productId}`);
      }
      setIsDragging(false);
    },
    [isDragging, navigate, productId]
  );

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div
      className='relative mx-0.5 mb-10 h-44 w-36 cursor-pointer bg-white'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}>
      <div className='absolute left-0 top-0 rounded-br border border-[#00835F] bg-white px-1 py-0.5 text-xs font-light text-[#00835F]'>
        광고
      </div>
      <div className='mb-2 flex justify-center'>
        {!imgError ? (
          <div className='relative h-[141.2px] w-full'>
            <img
              src={productImage}
              alt={productName}
              className='h-full w-full object-cover'
              onError={handleImageError}
            />
            {product.soldOut && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <span className='text-2xl font-bold text-red-500'>품절</span>
              </div>
            )}
          </div>
        ) : (
          <div className='flex h-[141.2px] w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-4'>
            <div className='text-center'>
              <FaLeaf className='mx-auto mb-2 text-4xl text-green-500' />
              <h3 className='break-words text-sm font-semibold text-green-700'>{productName}</h3>
            </div>
            {product.soldOut && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <span className='text-2xl font-bold text-red-500'>품절</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className='flex items-center'>
        <h3 className='flex justify-start truncate text-sm font-semibold'>{productName}</h3>
        <span className='mr whitespace-nowrap rounded bg-white px-1 py-0.5 text-xs font-semibold text-red-500'>
          {discountRate}%
        </span>
      </div>
      <div className='flex-col items-start'>
        <span className='text-xs text-gray-500 line-through'>{price.toLocaleString()}원</span>
        <span className='ml-2 text-sm font-bold text-red-500'>
          {discountedPrice.toLocaleString()}원
        </span>
      </div>
    </div>
  );
};

export default AdvertisementProductItem;
