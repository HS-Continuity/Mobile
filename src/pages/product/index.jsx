import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaChevronDown, FaLeaf, FaMinusCircle, FaShare } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { BsHouse, BsLightningChargeFill } from "react-icons/bs";
import { MdChevronRight } from "react-icons/md";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

import PriceBox from "../../components/Product/PriceBox";
import DetailImage from "../../components/Product/DetailImage";
import ReviewList from "../../components/Product/ReviewList";
import StarRating from "../../components/Product/StarRating";
import Modal from "./Modal";
import ProductInfoModal, { MODAL_TYPES } from "./ProductInfoModal";
import {
  fetchEcoProductImage,
  fetchProductDetail,
  fetchProductDetailImage,
  postCartItem,
} from "../../apis";
import useAuthStore from "../../stores/useAuthStore";

const ProductDetail = () => {
  const { username, isAuthenticated } = useAuthStore();
  const memberId = username;
  // const memberId = import.meta.env.VITE_MEMBER_ID;
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAddCartOpen, setIsAddCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("regular");
  const [activeModal, setActiveModal] = useState(null);
  const [imgError, setImgError] = useState(false);

  // 상품 정보 가져오기
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetail(productId),
  });

  // 상품 이미지 가져오기
  const {
    data: images,
    isImageLoading,
    isImageError,
  } = useQuery({
    queryKey: ["images", productId],
    queryFn: () => fetchProductDetailImage(productId),
  });

  // 친환경 인증 이미지 가져오기 (친환경 제품일 경우에만)
  const {
    data: ecoImages,
    isEcoImageLoading,
    isEcoImageError,
  } = useQuery({
    queryKey: ["ecoimages", productId],
    queryFn: () => fetchEcoProductImage(productId),
    enabled: product?.isCertification === "ACTIVE",
    retry: false, // 실패 시 재시도하지 않음
    onError: error => {
      console.warn("친환경 이미지를 불러오는데 실패했습니다:", error.message);
    },
  });

  // 장바구니 추가 mutation
  const addToCartMutation = useMutation({
    mutationFn: postCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
      // 성공 시 토스트 알림
      toast.success(
        <div>
          장바구니에 담겼습니다.
          <button
            className='btn btn-sm ml-3 bg-green-shine text-white hover:bg-[#00835F]'
            onClick={() => {
              navigate("/cart");
            }}>
            장바구니 가기
          </button>
        </div>,
        {
          style: {
            border: "1px solid #00835F",
            padding: "12px",
            color: "black",
          },
          iconTheme: {
            primary: "#00835F",
            secondary: "#FFFAEE",
          },
          duration: 2000,
          position: "bottom-center",
        }
      );
    },
  });

  // 이미지 에러 핸들러
  const handleImageError = () => {
    setImgError(true);
  };

  // 수량 증감 핸들러
  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);

  // 장바구니 추가 함수
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.", {
        duration: 1000,
        position: "bottom-center",
      });
      navigate("/login");
      return;
    }

    const cartItem = {
      productId: Number(productId),
      memberId: memberId,
      cartTypeId: purchaseType === "regular" ? 1 : 2,
      quantity: quantity,
    };
    addToCartMutation.mutate(cartItem);
  };

  // 공유 버튼 핸들러 (URL 복사)
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success("URL이 클립보드에 복사되었습니다!", {
          style: {
            border: "1px solid #00835F",
            padding: "12px",
            color: "black",
          },
          iconTheme: {
            primary: "#00835F",
            secondary: "#FFFAEE",
          },
          duration: 2000,
          position: "bottom-center",
        });
      })
      .catch(err => {
        console.error("URL 복사 실패:", err);
        toast.error("URL 복사에 실패했습니다.");
      });
  };

  // 모달 열기/닫기 및 제목 설정
  const openModal = modalType => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  // 데이터 로딩/에러 처리
  const getModalTitle = () => {
    switch (activeModal) {
      case MODAL_TYPES.PRODUCT_INFO:
        return "상품 상세 정보";
      case MODAL_TYPES.SHIPPING_INFO:
        return "배송 정보";
      case MODAL_TYPES.RETURN_POLICY:
        return "교환 및 반품 정책";
      default:
        return "";
    }
  };

  if (isLoading || isImageLoading || isEcoImageLoading) return <div>Loading...</div>;
  if (isError || isImageError || isEcoImageError) return <div>Error loading product data</div>;

  return (
    <>
      <div className='mx-auto bg-gray-50'>
        {/* 상품 이미지 및 정보 표시 */}
        {!imgError ? (
          <div>
            <img
              src={product.productImage}
              alt={product.productName}
              className='h-96 w-full object-cover'
              onError={handleImageError}
            />
            {product.soldOut && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <span className='text-2xl font-bold text-red-500'>품절</span>
              </div>
            )}
          </div>
        ) : (
          <div className='flex h-96 w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-4'>
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

        <div className='mb-3 bg-white p-4'>
          {/* 상품 상세 이미지, 리뷰 */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex'>
              <h1 className='mr-4 text-2xl font-bold'>{product.productName}</h1>
              <Link to={`/shop/${product.customerId}`}>
                <div className='mt-[2px] flex'>
                  <BsHouse className='mt-[3px] text-lg' />
                  <h3 className='ml-2 mt-[2px]'>{product.customerId}</h3>
                  <MdChevronRight className='ml-1 mt-[5px]' />
                </div>
              </Link>
            </div>
            <div className='flex items-center'>
              <div className='flex space-x-2'>
                <button className='btn btn-circle btn-sm' onClick={handleShare}>
                  <FaShare />
                </button>
              </div>
            </div>
          </div>
          <div className='mr-4 flex items-center'>
            <StarRating rating={product.averageScore} />
          </div>
          <p className='mb-4 text-gray-600'>{product.productDescription}</p>

          {/* 상품 가격 */}
          <div className='mb-4 space-y-2'>
            {product.isRegularSale == "ACTIVE" && (
              <PriceBox
                originalPrice={product.productPrice}
                discountRate={product.regularDiscountRate}
                finalPrice={product.calculatedRegularPrice}
                isRegular={true}
              />
            )}
            <PriceBox
              originalPrice={product.productPrice}
              discountRate={product.baseDiscountRate}
              finalPrice={product.calculatedBasePrice}
              isRegular={false}
            />
          </div>
        </div>

        {/* 상품 상세 이미지 */}
        <div className='mb-3 bg-white'>
          <div id='product-image'>
            <DetailImage
              productImage={images}
              ecoImages={ecoImages}
              isEcoCertified={product.isCertification === "ACTIVE"}
            />
          </div>
        </div>

        {/* 리뷰 */}
        <div className='mb-3 bg-white p-4'>
          <div id='review-section'>
            <ReviewList productId={productId} product_name={product.productName} />
          </div>
        </div>

        {/* 고시 정보 */}
        <div className='mb-3 space-y-2 bg-white p-4' id='product-info'>
          <p>고시 정보</p>
          <div className='flex gap-2'>
            <button
              onClick={() => openModal("PRODUCT_INFO")}
              className='btn btn-sm h-12 flex-1 border-gray-200 bg-white'>
              상품 정보
            </button>
            <button
              onClick={() => openModal("SHIPPING_INFO")}
              className='btn btn-sm h-12 flex-1 border-gray-200 bg-white'>
              배송 정보
            </button>
            <button
              onClick={() => openModal("RETURN_POLICY")}
              className='btn btn-sm h-12 flex-1 border-gray-200 bg-white'>
              교환 및 반품 정책
            </button>
          </div>
        </div>
      </div>

      {/* 구매 옵션 (장바구니 열림 시) */}
      {isAddCartOpen && (
        <div className='main-container fixed bottom-[64px] w-full rounded-t-lg bg-white p-4 pb-0 shadow'>
          <div className='relative -mt-8 mb-2 flex justify-center'>
            <button
              onClick={() => setIsAddCartOpen(false)}
              className='flex h-8 w-16 items-center justify-center rounded-full bg-white focus:outline-none'>
              <FaChevronDown className='text-xl text-gray-600 transition-colors duration-200 hover:text-gray-900' />
            </button>
          </div>
          <div className='mb-4 flex items-center justify-between'>
            <span className='ml-3 flex-1 truncate text-xl font-bold'>{product.productName}</span>
            <div className='mr-3 flex items-center space-x-2'>
              <div className='flex items-center rounded-md border'>
                <button
                  onClick={handleDecrease}
                  className='px-3 py-2 text-gray-500 hover:bg-gray-100'
                  disabled={quantity === 1}>
                  <AiOutlineMinus />
                </button>
                <input
                  type='text'
                  value={quantity}
                  readOnly
                  className='w-12 border-none text-center focus:outline-none'
                />
                <button
                  onClick={handleIncrease}
                  className='px-3 py-2 text-gray-500 hover:bg-gray-100'>
                  <AiOutlinePlus />
                </button>
              </div>
            </div>
          </div>

          {product.isRegularSale == "ACTIVE" && (
            <div className='mr-7 mt-3 flex items-end justify-end rounded-lg text-sm text-blue-600'>
              <div className='flex animate-bounce items-center'>
                <BsLightningChargeFill className='mr-2 text-lg' />
                <span>
                  정기 배송 시 매달
                  <span className='font-bold'>
                    {(
                      (product.baseDiscountedPrice - product.calculatedRegularPrice) *
                      quantity
                    ).toLocaleString()}
                    원
                  </span>
                  할인!
                </span>
              </div>
            </div>
          )}

          <div className='grid grid-cols-2 gap-3 p-2'>
            {[
              { price: product.calculatedBasePrice, label: "단건구매", type: "regular" },
              ...(product.isRegularSale === "INACTIVE"
                ? []
                : [
                    {
                      price: product.calculatedRegularPrice,
                      label: "정기배송",
                      type: "subscription",
                    },
                  ]),
            ].map(({ price, label, type }, index) => (
              <button
                key={index}
                onClick={() => setPurchaseType(type)}
                className={`flex flex-col items-center justify-center rounded-lg p-3 transition-all duration-200 ${
                  purchaseType === type
                    ? "border-2 border-[#00835F] text-black"
                    : "border-2 border-gray-300 bg-white text-gray-700"
                } focus:outline-none`}>
                <span
                  className={`mb-1 text-sm ${purchaseType === type ? "text-black" : "text-gray-500"}`}>
                  {label}
                </span>
                <span className='text-lg font-bold'>{(price * quantity).toLocaleString()}원</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 구매 버튼 */}
      <div className='main-container fixed bottom-0 left-0 right-0 z-30 mx-auto w-full bg-white p-2 shadow-sm'>
        <button
          className='btn w-full bg-[#00835F] text-base text-white hover:bg-[#00835F]'
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
          }}
          onClick={isAddCartOpen ? handleAddToCart : () => setIsAddCartOpen(true)}>
          <CiShoppingCart className='mr-1 text-3xl text-white' />
          {isAddCartOpen ? "장바구니 담기" : "구매 하기"}
        </button>
      </div>

      {/* 모달 */}
      <div className='main-container'>
        <Modal isOpen={!!activeModal} onClose={closeModal} title={getModalTitle()}>
          <ProductInfoModal product={product} activeModal={activeModal} />
        </Modal>
      </div>

      {/* toast 알림 */}
      <Toaster />
    </>
  );
};

export default ProductDetail;
