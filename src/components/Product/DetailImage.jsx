import React, { useState, useCallback } from "react";

const DetailImage = ({ productImage, ecoImages, isEcoCertified }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const hasCertificationImage = ecoImages && "certificationImage" in ecoImages;

  return (
    <div className='my-4 mt-10'>
      <div
        className={`relative transition-all duration-500 ease-in-out ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
        {isEcoCertified && (
          <div className='mb-4 rounded-md bg-green-100 p-2'>
            <p className='font-semibold text-green-700'>이 제품은 친환경 인증을 받았습니다.</p>
          </div>
        )}

        {isEcoCertified && hasCertificationImage && (
          <>
            <h3 className='mb-2 text-lg font-semibold'>친환경 인증서</h3>
            <img
              src={ecoImages.certificationImage}
              alt={ecoImages.certificationName || "친환경 인증서"}
              className='mb-4 w-full object-cover'
            />
          </>
        )}
        {productImage && (
          <img src={productImage} alt='Product Detail' className='mb-4 w-full object-cover' />
        )}
        {!isExpanded && (
          <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent' />
        )}
      </div>
      <button
        onClick={toggleExpand}
        className='mt-2 w-full rounded-md bg-gray-200 px-4 py-2 transition-colors duration-200 hover:bg-gray-300'>
        {isExpanded ? "사진 접기" : "사진 전부 보기"}
      </button>
    </div>
  );
};

export default React.memo(DetailImage);
