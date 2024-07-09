import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className='text-yellow-400' />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalf key={i} className='text-yellow-400' />);
    } else {
      stars.push(<FaRegStar key={i} className='text-gray-300' />);
    }
  }

  return <div className='flex'>{stars}</div>;
};

const ReviewBox = ({
  product_review_id,
  review_score,
  member_id,
  create_date,
  review_content,
  product_name,
}) => {
  return (
    <>
      <div key={product_review_id} className='mb-4 rounded-lg border p-4'>
        <div className='mb-2 flex items-center'>
          <StarRating rating={review_score} />
          <span className='ml-2 font-bold'>사용자 {member_id}</span>
          <span className='ml-2 text-gray-500'>{new Date(create_date).toLocaleDateString()}</span>
        </div>
        <p className='text-sm text-gray-400'>{product_name}</p>
        <p>{review_content || "내용 없음"}</p>
      </div>
    </>
  );
};

export default ReviewBox;
