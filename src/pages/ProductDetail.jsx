import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaShare, FaStar } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { fetchProduct } from "../apis";
import PriceBox from "../components/Product/PriceBox";
import DetailImage from "../components/Product/DetailImage";
import { useProductReviewStore } from "../stores/useProductReviewStore";
import ReviewList from "../components/Product/ReviewList";
const ProductDetail = () => {
  const { productId } = useParams();
  const { averageRating } = useProductReviewStore();
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading product</div>;

  const baseDiscountRate = product.base_discount_rate || 0;
  const regularDiscountRate = product.regular_discount_rate || 0;
  const originalPrice = product.product_price;
  const baseDiscountedPrice = originalPrice * (1 - baseDiscountRate / 100);
  const regularDiscountedPrice = originalPrice * (1 - regularDiscountRate / 100);

  return (
    <>
      <div className='container mx-auto p-4 pb-24'>
        <img
          src={product.product_image}
          alt={product.product_name}
          className='mb-4 h-64 w-full rounded-lg object-cover'
        />
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>{product.product_name}</h1>
          <div className='flex items-center'>
            <div className='mr-4 flex items-center'>
              <FaStar className='mr-1 text-yellow-400' />
              <span>{averageRating}</span>
            </div>
            <div className='flex space-x-2'>
              <button className='btn btn-circle btn-sm'>
                <FaHeart />
              </button>
              <button className='btn btn-circle btn-sm'>
                <FaShare />
              </button>
            </div>
          </div>
        </div>
        <p className='mb-4 text-gray-600'>{product.product_description}</p>
        <div className='mb-4 space-y-2'>
          <PriceBox
            originalPrice={originalPrice}
            discountRate={baseDiscountRate}
            finalPrice={baseDiscountedPrice}
            isRegular={false}
          />
          {product.is_regular_sale && (
            <PriceBox
              originalPrice={originalPrice}
              discountRate={regularDiscountRate}
              finalPrice={regularDiscountedPrice}
              isRegular={true}
            />
          )}
        </div>
        <div className='mt-4 rounded-lg bg-gray-100 p-4'>
          <h2 className='mb-2 font-bold'>상품 정보</h2>
          <p>원산지: {product.product_origin}</p>
          <p>판매자: {product.customer_id}</p>
          {product.is_regular_sale && <p className='text-green-600'>정기 배송 가능</p>}
        </div>
        <DetailImage imageUrl={product.product_image} />
        <ReviewList productId={productId} product_name={product.product_name} />
      </div>
      <div className='fixed bottom-14 left-0 right-0 z-50 mx-auto w-full bg-white p-4 shadow-sm sm:max-w-full md:max-w-full lg:max-w-[500px] xl:max-w-[500px]'>
        <button className='btn btn-primary w-full'>
          <CiShoppingCart className='mr-2 text-3xl' /> 구매하기
        </button>
      </div>
    </>
  );
};

export default ProductDetail;
