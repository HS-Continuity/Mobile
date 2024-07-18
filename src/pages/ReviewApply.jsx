import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StarDisplay = ({ rating }) => {
  return (
    <div className='flex'>
      {[1, 2, 3, 4, 5].map(star => {
        if (star <= Math.floor(rating)) {
          return <FaStar key={star} className='text-yellow-400' />;
        } else if (star === Math.ceil(rating) && !Number.isInteger(rating)) {
          return <FaStarHalfAlt key={star} className='text-yellow-400' />;
        } else {
          return <FaRegStar key={star} className='text-gray-300' />;
        }
      })}
    </div>
  );
};

const ReviewApply = () => {
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // 여기에 리뷰 제출 로직을 추가합니다.
    console.log({ rating, review, images });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 rounded-lg bg-white p-4 shadow'>
      <h2 className='mb-4 text-xl font-bold'>리뷰 작성</h2>

      <div>
        <label className='mb-2 block font-semibold'>별점</label>
        <div className='flex items-center space-x-4'>
          <select
            value={rating}
            onChange={e => setRating(parseFloat(e.target.value))}
            className='rounded-lg border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'>
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <StarDisplay rating={rating} />
        </div>
      </div>

      <div>
        <label className='mb-2 block font-semibold'>이미지 업로드</label>
        <div className='flex items-center space-x-2'>
          <label className='cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600'>
            <FiUpload className='mr-2 inline-block' />
            이미지 선택
            <input
              type='file'
              className='hidden'
              multiple
              onChange={handleImageUpload}
              accept='image/*'
            />
          </label>
          <span className='text-sm text-gray-500'>{images.length}개의 이미지 선택됨</span>
        </div>
      </div>

      <div>
        <label htmlFor='review' className='mb-2 block font-semibold'>
          상품평
        </label>
        <textarea
          id='review'
          rows='4'
          className='w-full rounded-lg border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder='상품에 대한 평가를 작성해주세요.'></textarea>
      </div>

      <div className='flex justify-end space-x-2'>
        <button type='button' className='btn btn-outline' onClick={() => navigate(-1)}>
          취소
        </button>
        <button type='submit' className='btn btn-primary'>
          등록하기
        </button>
      </div>
    </form>
  );
};

export default ReviewApply;
