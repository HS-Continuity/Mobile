import StarRating from "./StarRating";

const ReviewBox = ({
  product_review_id,
  review_score,
  member_id,
  create_date,
  review_content,
  product_name,
  reviewImage,
}) => {
  const handleImageClick = () => {
    if (reviewImage) {
      const windowFeatures = "width=800,height=600,resizable=yes,scrollbars=yes,status=yes";
      window.open(reviewImage, "_blank", windowFeatures);
    }
  };

  return (
    <div key={product_review_id} className='mb-4 rounded-lg border p-4'>
      <div className='mb-2 flex items-center'>
        <StarRating rating={review_score} />
        <span className='ml-2 font-bold'>{member_id}</span>
        <span className='ml-2 text-gray-500'>{new Date(create_date).toLocaleDateString()}</span>
      </div>
      <p className='text-sm text-gray-400'>{product_name}</p>
      {reviewImage && (
        <div className='my-2'>
          <img
            src={reviewImage}
            alt='리뷰이미지'
            className='mx-auto h-20 w-20 cursor-pointer object-cover'
            onClick={handleImageClick}
          />
        </div>
      )}
      <p>{review_content || "내용 없음"}</p>
    </div>
  );
};

export default ReviewBox;
