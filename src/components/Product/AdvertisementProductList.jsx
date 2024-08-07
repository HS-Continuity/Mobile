import Slider from "react-slick";
import AdvertisementProductItem from "./AdvertisementProductItem";
import TimesaleListSkeleton from "../Skeletons/TimesaleListSkeleton";
import { fetchAdvertisementProductList } from "../../apis";
import { useQuery } from "@tanstack/react-query";
import { AdvertisementError } from "../Errors/ErrorDisplay";

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
    afterChange: function (index) {},
  };

  if (isError || error === 0) {
    return <AdvertisementError />;
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
