import React, { useState } from "react";

const DetailImage = ({ imageUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      <div className='my-4 mt-10'>
        <div
          className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "h-auto" : "h-[300px]"
          }`}>
          <img src={imageUrl} alt='Product Detail' className='w-full object-cover' />
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
    </>
  );
};

export default DetailImage;
