import { useEffect } from "react";
import { useProductReviewStore } from "../../stores/useProductReviewStore";
import ReviewBox from "./ReviewBox";
import { useNavigate } from "react-router-dom";

const ReviewList = ({ productId, product_name }) => {
  const { reviews, fetchReviews } = useProductReviewStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews(productId);
  }, [productId, fetchReviews]);

  const handleViewAllReviews = () => {
    navigate(`/product/review/${productId}`);
    window.scrollTo(0, 0);
  };

  const displayReviews = [...reviews].sort(
    (a, b) => new Date(b.create_date) - new Date(a.create_date)
  );

  return (
    <div className='mt-8'>
      {displayReviews.slice(0, 3).map(review => (
        <ReviewBox
          key={review.product_review_id}
          product_review_id={review.product_review_id}
          review_score={review.review_score}
          member_id={review.member_id}
          create_date={review.create_date}
          review_content={review.review_content}
          product_name={product_name}
        />
      ))}

      <button className='btn btn-outline w-full' onClick={handleViewAllReviews}>
        이 상품의 상품평 모두 보기
      </button>
    </div>
  );
};

export default ReviewList;
