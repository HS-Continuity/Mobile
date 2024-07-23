import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductSlider = () => {
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
  };

  const images = [
    "https://contents.lotteon.com/display/dshoplnk/12905/2/M001596/493809/P590B2349CD8BD86C03DC69A221F2A1E1559AA9D75AB7BD42DDC9FDC9A268271F/file/dims/optimize",
    "https://contents.lotteon.com/display/dshoplnk/12905/2/M001596/494389/P10EF97AB6D743CF39A6739C108168FD0B0C01668B34CCD39400B048B40BE518B/file/dims/optimize",
    "https://contents.lotteon.com/display/dshoplnk/12905/2/M001596/494396/PCBD0858EE606E0C6517CAD15C8B335FADD37504E88EF2534E77D57BA837EFAA8/file/dims/optimize",
    "https://contents.lotteon.com/display/dshoplnk/12905/2/M001596/494388/PEEA1D7AA63A1A56737F3056DF51D7235DA354F5CE917ED46168CE61979BBD134/file/dims/optimize",
    "https://contents.lotteon.com/display/dshoplnk/12905/2/M001596/494385/P62FAA069C25F9FC4830E928EB2A27921863BE5728CD11E3749B977338AAF7D42/file/dims/optimize",
  ];

  return (
    <div className='slider-container mb-5'>
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className='relative'>
            <img src={src} alt={`image${index + 1}`} style={{ width: "100%", height: "auto" }} />
            <div className='absolute bottom-0 left-0 w-full p-4'>
              <p className='text-5xl font-extrabold text-white'>정승수</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
