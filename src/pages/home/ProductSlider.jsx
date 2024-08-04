import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductSliderSkeleton from "../../components/Skeletons/ProductSliderSkeleton";
import Kwon from "../../assets/images/kwon.png";
import Kim from "../../assets/images/kim.png";
import Ku from "../../assets/images/ku.jpg";
import Jung from "../../assets/images/jung.png";
import { Link } from "react-router-dom";

const ProductSlider = () => {
  const slides = [
    { image: Kwon, text: "권수현", shop: 1 },
    { image: Kim, text: "김우재", shop: 2 },
    { image: Ku, text: "구태호", shop: 3 },
    { image: Jung, text: "정승수", shop: 4 },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    draggable: true,
    swipe: true,
    touchMove: true,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className='slider-container mb-5'>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className='relative'>
            <Link to={`/shop/${slide.shop}`}>
              <img
                src={slide.image}
                alt={`image${index + 1}`}
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <div className='absolute bottom-0 left-0 w-full p-4'>
                <p className='text-shadow-md text-5xl font-extrabold text-white'>{slide.text}</p>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
