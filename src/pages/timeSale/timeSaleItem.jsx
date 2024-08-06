import { Link, useNavigate } from "react-router-dom";
import StarRating from "../../components/Product/StarRating";
import { useState, useEffect } from "react";
import { FaLeaf } from "react-icons/fa";
import CountdownTimer from "../../components/Product/CountdownTimer";

const TimeSaleItem = ({ product }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});

  // Detail 페이지로 이동
  const handleShopNavigator = e => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shop/${product.customerId}`);
  };

  // 이미지 에러 핸들러
  const handleImageError = () => {
    setImgError(true);
  };

  // 할인된 가격 계산
  const discountedPrice = product.price * (1 - product.discountRate / 100);

  // 카운트다운 타이머 로직
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(product.endDateTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product.endDateTime]);

  return (
    <>
      <Link to={`/timesale/${product.productTimesaleId}`} className='card bg-base-100 shadow-sm'>
        <figure className='relative'>
          {!imgError ? (
            <div className='relative h-72 w-full'>
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
          <div className='absolute bottom-0 w-full p-2 text-center text-info-content'>
            <CountdownTimer endDateTime={product.endDateTime} />
          </div>
          <div className='badge absolute right-2 top-2 bg-[#3b82f6] text-white'>타임세일</div>
        </figure>
        <div className='card-body p-4'>
          <p className='text-md text-gray-600' onClick={handleShopNavigator}>
            <span className='cursor-pointer text-blue-500 underline'>{product.storeName}</span>
          </p>
          <h2 className='card-title -mt-2 text-lg'>{product.productName}</h2>
          <div className='flex items-center justify-between'>
            <div>
              <span className='text-lg font-extrabold text-red-500'>{product.discountRate}%</span>
              <p className='text-2xl font-bold text-black'>
                {discountedPrice.toLocaleString()}원
                <span className='ml-2 text-lg font-normal text-gray-400 line-through'>
                  {product.price.toLocaleString()}원
                </span>
              </p>
            </div>
          </div>
          <div className='flex items-center'>
            <StarRating rating={product.averageRating} count={product.reviewCount} />
          </div>
          <div className='divider my-1'></div>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center'>
              <span>시작: {new Date(product.startDateTime).toLocaleString()}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-red-500'>
                종료: {new Date(product.endDateTime).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default TimeSaleItem;
