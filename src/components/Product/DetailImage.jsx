import { useState, useCallback } from "react";
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaLeaf } from "react-icons/fa";
import DetailDefaultImage from "../../assets/images/detail_image.jpg";
import CertDefaultImage from "../../assets/images/certification.jpg";

const DetailImage = ({ productImage, ecoImages, isEcoCertified }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgDetailError, setImgDetailError] = useState(false);
  const [imgCertErrors, setImgCertErrors] = useState({});

  const handleDetailImageError = () => {
    setImgDetailError(true);
  };

  const handleCertImageError = index => {
    setImgCertErrors(prev => ({ ...prev, [index]: true }));
  };

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const hasCertificationImages = Array.isArray(ecoImages) && ecoImages.length > 0;

  return (
    <div className='p-4'>
      <div
        className={`relative transition-all duration-500 ease-in-out ${
          isExpanded ? "" : "max-h-[300px] overflow-hidden"
        }`}>
        {isEcoCertified && (
          <div className='mb-4 overflow-hidden rounded-lg bg-gradient-to-r from-[#00835F] to-green-500 p-3 shadow-lg transition-all duration-300 hover:shadow-xl'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <FaLeaf className='animate-bounce text-2xl text-white' />
                <p className='text-lg font-bold text-white'>친환경 인증 제품</p>
              </div>
              <FaCheckCircle className='text-2xl text-white' />
            </div>
            <p className='mt-2 text-sm text-white'>
              이 제품은 엄격한 기준을 통과한 친환경 인증을 받았습니다.
            </p>
          </div>
        )}

        {isEcoCertified && (
          <>
            {hasCertificationImages ? (
              ecoImages.map((image, index) =>
                !imgCertErrors[index] ? (
                  <img
                    key={index}
                    src={image.certificationImage}
                    alt={`친환경 인증서 ${index + 1}`}
                    className='mb-4 w-full object-cover'
                    onError={() => handleCertImageError(index)}
                  />
                ) : (
                  <img
                    key={index}
                    src={CertDefaultImage}
                    alt={`친환경 인증서 ${index + 1}`}
                    className='mb-4 w-full object-cover'
                  />
                )
              )
            ) : (
              <img
                src={CertDefaultImage}
                alt='기본 친환경 인증서'
                className='mb-4 w-full object-cover'
              />
            )}
          </>
        )}
        {!imgDetailError ? (
          <img
            src={productImage}
            alt='Product Detail'
            className='mb-4 w-full object-cover'
            onError={handleDetailImageError}
          />
        ) : (
          <img
            src={DetailDefaultImage}
            alt='상품 상세 이미지'
            className='mb-4 w-full object-cover'
          />
        )}
        {!isExpanded && (
          <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent' />
        )}
      </div>
      <button
        onClick={toggleExpand}
        className='mt-4 flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 focus:outline-none'>
        {isExpanded ? (
          <>
            사진 접기 <FaChevronUp className='ml-2' />
          </>
        ) : (
          <>
            사진 전부 보기 <FaChevronDown className='ml-2' />
          </>
        )}
      </button>
    </div>
  );
};

export default DetailImage;
