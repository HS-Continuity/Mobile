import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiUpload, FiX } from "react-icons/fi";
import useAuthStore from "../../stores/useAuthStore";
import { postProductReview } from "../../apis";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ReviewApply = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { username } = useAuthStore();
  const memberId = username;

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);

  const reviewMutation = useMutation({
    mutationFn: postProductReview,
    onSuccess: () => {
      toast.success("리뷰가 성공적으로 등록되었습니다.");
      navigate(`/product/${productId}`);
    },
    onError: error => {
      console.error("리뷰 등록 중 오류 발생:", error);
      toast.error("리뷰 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    },
  });

  const handleImageUpload = e => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const currentDate = new Date().toISOString();

    const reviewData = {
      ofRegisterProductReview: {
        productId: parseInt(productId),
        memberId,
        createDate: currentDate,
        reviewContent: review,
        reviewScore: rating,
      },
      image: image,
    };

    reviewMutation.mutate(reviewData);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className='text-5xl text-yellow-400' />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key='half' className='text-5xl text-yellow-400' />);
    }

    while (stars.length < 5) {
      stars.push(<FaStar key={`empty-${stars.length}`} className='text-5xl text-gray-300' />);
    }

    return stars;
  };

  return (
    <div className='bg-white p-4'>
      <form onSubmit={handleSubmit} className='space-y-6 bg-white p-4'>
        <div>
          <div className='flex flex-col items-center space-y-2'>
            <div className='mb-8 mt-3 flex'>{renderStars()}</div>
            <input
              type='range'
              min='20'
              max='100'
              value={rating * 20}
              onChange={e => setRating(Math.round((e.target.value / 20) * 2) / 2)}
              className='range [--range-shdw:#00835F]'
              step='10'
            />
            <div className='flex w-full justify-between px-2 text-xs'>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <span className='text-md text-gray-500'>{rating} / 5</span>
          </div>
        </div>

        <div>
          <label htmlFor='review' className='mb-2 block text-sm font-semibold text-gray-700'>
            상품평
          </label>
          <textarea
            id='review'
            rows='2'
            className='textarea textarea-bordered w-full'
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder='상품에 대한 평가를 작성해주세요.'></textarea>
        </div>

        <div>
          <div className='flex items-center justify-start gap-4'>
            <label className='btn btn-sm bg-transparent hover:bg-transparent'>
              <FiUpload className='mr-2 inline-block' />
              이미지 (선택)
              <input type='file' className='hidden' onChange={handleImageUpload} accept='image/*' />
            </label>
            {image && (
              <div className='relative'>
                <img
                  src={URL.createObjectURL(image)}
                  alt='Preview'
                  className='h-10 w-10 rounded-md object-cover'
                />
                <button
                  type='button'
                  onClick={handleRemoveImage}
                  className='btn btn-circle btn-xs absolute -right-2 -top-2 bg-red-500 text-white'>
                  <FiX />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-center space-x-2'>
          <button
            type='button'
            className='btn btn-md bg-transparent hover:bg-transparent'
            onClick={() => navigate(-1)}>
            취소
          </button>
          <button
            type='submit'
            className='btn btn-md bg-green-shine text-white'
            disabled={reviewMutation.isLoading}>
            {reviewMutation.isLoading ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewApply;
