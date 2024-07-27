import { useQuery } from "@tanstack/react-query";
import { fetchLatestProductReviews } from "../../apis";
import ReviewBox from "./ReviewBox";
import ReviewBoxSkeleton from "../Skeletons/ReviewBoxSkeleton";
import { useNavigate } from "react-router-dom";
import { FaRegCommentDots } from "react-icons/fa";

const ReviewList = ({ productId, productName }) => {
  const navigate = useNavigate();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["latestReviews", productId],
    queryFn: () => fetchLatestProductReviews(productId),
  });

  const handleViewAllReviews = () => {
    navigate(`/product/review/${productId}`, { state: { productName } });
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className='mt-8'>
        {[...Array(3)].map((_, index) => (
          <ReviewBoxSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className='mt-8'>
      {reviews.content && reviews.content.length > 0 ? (
        <>
          {reviews.content.map(review => (
            <ReviewBox
              key={review.productReviewId}
              product_review_id={review.productReviewId}
              review_score={review.reviewScore}
              member_id={review.memberId}
              create_date={review.createDate}
              review_content={review.reviewContent}
              review_image={review.reviewImage}
              product_name={productName}
              reviewImage={review.reviewImage}
            />
          ))}
          <button
            className='btn mt-4 w-full border-gray-300 bg-white hover:border-gray-300 hover:bg-white'
            onClick={handleViewAllReviews}>
            상품평 더보기 ({reviews.content.length})
          </button>
        </>
      ) : (
        <div className='-mt-7 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
          <FaRegCommentDots className='mb-4 text-4xl text-gray-400' />
          <p className='text-lg font-semibold text-gray-600'>아직 리뷰가 없습니다.</p>
          <p className='mt-2 text-sm text-gray-500'>첫 번째 리뷰를 작성해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
