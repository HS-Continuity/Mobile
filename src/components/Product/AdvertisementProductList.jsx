import Slider from "react-slick";
import AdvertisementProductItem from "./AdvertisementProductItem";
import TimesaleListSkeleton from "../Skeletons/TimesaleListSkeleton";
import { fetchAdvertisementProductList } from "../../apis";
import { useQuery } from "@tanstack/react-query";

function AdvertisementProductList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["advertisementProductList"],
    queryFn: () => fetchAdvertisementProductList({ startPage: 0, pageSize: 5 }),
    retry: 2,
    retryDelay: 1000,
    onError: error => {
      console.error("Failed to fetch advertisement products:", error);
    },
  });

  if (isLoading) {
    return (
      <div className='container mx-auto p-4'>
        <TimesaleListSkeleton count={3} gridCols={3} />
      </div>
    );
  }

  const products = data?.data?.result || [];

  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "20px",
    slidesToShow: 2.7,
    swipeToSlide: true,
    afterChange: function (index) {
      console.log(`Slider Changed to: ${index + 1}, background: #222; color: #bada55`);
    },
  };

  if (isError || products.length === 0) {
    return (
      <div className='py-4 text-center'>
        <p className='text-gray-600'>현재 추천 상품을 표시할 수 없습니다.</p>
        <p className='text-sm text-gray-500'>곧 정상화될 예정이니 잠시 후 다시 확인해 주세요.</p>
      </div>
    );
  }

  return (
    <div className='slider-container mx-auto max-w-6xl px-4'>
      {products.length === 1 ? (
        <div className='flex justify-center'>
          <AdvertisementProductItem product={products[0]} />
        </div>
      ) : (
        <Slider {...settings}>
          {products.map(product => (
            <div key={product.productId}>
              <AdvertisementProductItem product={product} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default AdvertisementProductList;
