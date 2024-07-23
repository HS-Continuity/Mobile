import { useNavigate, useLocation, useParams } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { fetchCartItemsCount, fetchProductDetail } from "../../apis";
import { FiSearch } from "react-icons/fi";

const ProductTopHeader = () => {
  const memberId = import.meta.env.VITE_MEMBER_ID;
  const cartTypeId = null;
  const navigate = useNavigate();
  const { productId } = useParams();

  const { data: cartItemsCount } = useQuery({
    queryKey: ["cart", memberId, cartTypeId],
    queryFn: () => fetchCartItemsCount(memberId, cartTypeId),
  });

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetail(productId),
  });

  const handleScroll = target => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <div className='mx-auto flex h-14 items-center justify-between px-4'>
        <MdArrowBackIosNew className='cursor-pointer text-xl' onClick={() => navigate(-1)} />
        <div className='flex flex-grow justify-center space-x-10'>
          <div className='cursor-pointer' onClick={() => handleScroll("product-image")}>
            상품 이미지
          </div>
          <div className='cursor-pointer' onClick={() => handleScroll("review-section")}>
            {isLoading
              ? "리뷰 로딩 중..."
              : isError
                ? "리뷰 정보 오류"
                : `리뷰(${product?.reviewCount || 0})`}
          </div>
          <div className='cursor-pointer' onClick={() => handleScroll("product-info")}>
            상품 정보
          </div>
        </div>
        <div className='flex items-center space-x-5'>
          <FiSearch className='cursor-pointer text-2xl' onClick={() => navigate("/search")} />
          <div className='relative cursor-pointer' onClick={() => navigate("/cart")}>
            <IoCartOutline className='h-7 w-7' />
            {cartItemsCount > 0 && (
              <span className='absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                {cartItemsCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProductTopHeader;
