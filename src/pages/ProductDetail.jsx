import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaChevronDown, FaHeart, FaMinus, FaPlus, FaShare, FaStar } from "react-icons/fa";
import { CiShop, CiShoppingCart } from "react-icons/ci";
// import { getLastCartItemId, postToCart } from "../apis";
import PriceBox from "../components/Product/PriceBox";
import DetailImage from "../components/Product/DetailImage";
// import { useProductReviewStore } from "../stores/useProductReviewStore";
import ReviewList from "../components/Product/ReviewList";
import { useState } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { fetchProductDetail, fetchProductDetailImage } from "../apis/Product";
import { postCartItem } from "../apis/Cart";

const ProductDetail = () => {
  const memberId = import.meta.env.VITE_MEMBER_ID;
  const { productId } = useParams();
  const [isAddCartOpen, setIsAddCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("regular");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetail(productId),
  });

  const {
    data: images,
    isImageLoading,
    isImageError,
  } = useQuery({
    queryKey: ["images", productId],
    queryFn: () => fetchProductDetailImage(productId),
  });

  const addToCartMutation = useMutation({
    mutationFn: postCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
      navigate("/cart");
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading product</div>;

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddToCart = async () => {
    const cartItem = {
      productId: Number(productId),
      memberId: memberId,
      cartTypeId: purchaseType === "regular" ? 1 : 2,
      quantity: quantity,
    };
    addToCartMutation.mutate(cartItem);
  };

  return (
    <>
      <div className='container mx-auto p-4 pb-24'>
        <img
          src={product.productImage}
          alt={product.productName}
          className='mb-4 h-64 w-full rounded-lg object-cover'
        />
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>{product.productName}</h1>
          <Link to={`/shop/${product.customerId}`}>
            <div className='group flex'>
              <CiShop className='mt-1 text-xl' />
              <h3 className='ml-1 group-hover:underline'>{product.customerId}</h3>
            </div>
          </Link>

          <div className='flex items-center'>
            <div className='mr-4 flex items-center'>
              <FaStar className='mr-1 text-yellow-400' />
              <span>{product.averageScore}</span>
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
        <p className='mb-4 text-gray-600'>{product.productDescription}</p>
        <div className='mb-4 space-y-2'>
          <PriceBox
            originalPrice={product.productPrice}
            discountRate={product.baseDiscountRate}
            finalPrice={product.calculatedBasePrice}
            isRegular={false}
          />
          {/* 정기 배송 상품 할인 컬럼명 수정해야함 */}
          {product.isRegularSale == "ACTIVE" && (
            <PriceBox
              originalPrice={product.productPrice}
              discountRate={product.regularDiscountRate}
              finalPrice={product.calculatedRegularPrice}
              isRegular={true}
            />
          )}
        </div>
        <div className='mt-4 rounded-lg bg-gray-100 p-4'>
          <h2 className='mb-2 font-bold'>상품 정보</h2>
          <p>원산지: {product.origin}</p>
          <p>판매자: {product.customerId}</p>
          {product.isRegularSale == "ACTIVE" && <p className='text-green-600'>정기 배송 가능</p>}
        </div>
        <DetailImage imageUrl={images} />
        <ReviewList productId={productId} product_name={product.productName} />
      </div>

      {isAddCartOpen ? (
        <div className='main-container fixed bottom-[120px] -ml-4 w-full rounded-t-lg bg-white p-4 pb-0 shadow'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='font-bold'>{product.productName}</span>
            <div className='flex items-center space-x-2'>
              <span>수량</span>
              <div className='flex items-center rounded-md border'>
                <button
                  className='btn btn-circle btn-ghost btn-sm'
                  onClick={handleDecrease}
                  disabled={quantity === 1}>
                  <FaMinus />
                </button>
                <span className='px-2'>{quantity}</span>
                <button className='btn btn-circle btn-ghost btn-sm' onClick={handleIncrease}>
                  <FaPlus />
                </button>
              </div>
            </div>
            <FaChevronDown
              onClick={() => setIsAddCartOpen(!isAddCartOpen)}
              className='cursor-pointer text-xl text-gray-500'
            />
          </div>
          <div className='flex flex-col items-center justify-center space-y-2'>
            {[
              { price: product.calculatedBasePrice, label: "단건구매", type: "regular" },
              ...(product.isRegularSale == "INACTIVE"
                ? []
                : [
                    {
                      price: product.calculatedRegularPrice,
                      label: "정기배송",
                      type: "subscription",
                      color: "text-red-500",
                    },
                  ]),
            ].map(({ price, label, type, color = "" }, index) => {
              const maxLengthLabel = Math.max(
                ...[product.calculatedBasePrice, product.calculatedRegularPrice].map(
                  p => p.toLocaleString().length + label.length
                )
              );
              const currentLabelLength = price.toLocaleString().length + label.length;
              const paddingLength = maxLengthLabel - currentLabelLength;
              const padding = "\u00A0".repeat(paddingLength);

              return (
                <label key={index} className={`flex items-center ${color}`}>
                  <input
                    type='radio'
                    name='purchase-option'
                    className='radio-primary radio'
                    checked={purchaseType === type}
                    onChange={() => setPurchaseType(type)}
                  />
                  <span className='ml-2'>
                    {price.toLocaleString()}원 | {label}
                    {padding}
                  </span>
                </label>
              );
            })}

            {product.isRegularSale == "ACTIVE" &&
              product.baseDiscountedPrice - product.calculatedRegularPrice > 0 && (
                <div className='flex items-center rounded bg-blue-100 p-2 text-sm text-blue-600'>
                  <BsLightningChargeFill className='mr-1' />
                  <span>
                    정기 배송 시 매달{"\u00A0"}
                    {(
                      (product.baseDiscountedPrice - product.calculatedRegularPrice) *
                      quantity
                    ).toLocaleString()}
                    원 할인!
                  </span>
                </div>
              )}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className='main-container fixed bottom-14 left-0 right-0 z-50 mx-auto w-full bg-white p-2 shadow-sm'>
        <button
          className='btn btn-primary w-full'
          onClick={isAddCartOpen ? handleAddToCart : () => setIsAddCartOpen(true)}>
          <CiShoppingCart className='mr-2 text-3xl' />
          {isAddCartOpen ? "장바구니 담기" : "구매 하기"}
        </button>
      </div>
    </>
  );
};

export default ProductDetail;
