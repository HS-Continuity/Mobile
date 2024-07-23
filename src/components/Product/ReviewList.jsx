import { useQuery } from "@tanstack/react-query";
import { fetchLatestProductReviews } from "../../apis";
import ReviewBox from "./ReviewBox";
import { useNavigate } from "react-router-dom";

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
    return <div>리뷰를 불러오는 중...</div>;
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
          <button className='btn btn-outline mt-4 w-full' onClick={handleViewAllReviews}>
            이 상품의 상품평 모두 보기
          </button>
        </>
      ) : (
        <p>아직 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default ReviewList;
