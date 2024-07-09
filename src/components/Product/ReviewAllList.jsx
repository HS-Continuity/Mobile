import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosRefresh } from "react-icons/io";
import ReviewBox from "./ReviewBox";
import ReviewListSkeleton from "../Skeletons/ReviewListSkeleton";
import { SORT_TYPES, useReviewStore } from "../../stores/useProductReviewStore";
import { useReviewQuery } from "../../apis/index";

const ReviewAllList = ({ productId, productName }) => {
  const navigate = useNavigate();
  const sortType = useReviewStore(state => state.sortType);
  const setSortType = useReviewStore(state => state.setSortType);
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useReviewQuery(productId, sortType);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleSort = newSortType => {
    if (newSortType !== sortType) {
      setSortType(newSortType);
      refetch();
    }
  };

  if (isLoading)
    return (
      <div className='mt-28'>
        {[...Array(5)].map((_, i) => (
          <ReviewListSkeleton key={i} />
        ))}
      </div>
    );
  if (isError) return <div>Error fetching reviews</div>;
  if (!data || data.pages.length === 0) return <div>No reviews available</div>;

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-4 flex items-center'>
        <FaChevronLeft className='cursor-pointer text-xl' onClick={() => navigate(-1)} />
        <h2 className='ml-4 text-xl font-bold'>고객 리뷰</h2>
      </div>

      <div className='mb-4'>
        <button
          className={`btn btn-ghost ${sortType === SORT_TYPES.LATEST ? "btn-active" : ""}`}
          onClick={() => handleSort(SORT_TYPES.LATEST)}>
          최신순
        </button>
        <button
          className={`btn btn-ghost ${sortType === SORT_TYPES.HIGHEST ? "btn-active" : ""}`}
          onClick={() => handleSort(SORT_TYPES.HIGHEST)}>
          별점 높은 순
        </button>
        <button
          className={`btn btn-ghost ${sortType === SORT_TYPES.LOWEST ? "btn-active" : ""}`}
          onClick={() => handleSort(SORT_TYPES.LOWEST)}>
          별점 낮은 순
        </button>
      </div>

      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.data.map(review => (
            <ReviewBox
              key={review.product_review_id}
              product_review_id={review.product_review_id}
              review_score={review.review_score}
              member_id={review.member_id}
              create_date={review.create_date}
              review_content={review.review_content}
              product_name={productName}
            />
          ))}
        </React.Fragment>
      ))}

      <div ref={ref} className='flex h-10 items-center justify-center'>
        {isFetchingNextPage ? (
          "리뷰 로딩중..."
        ) : hasNextPage ? (
          "Load More"
        ) : (
          <div className='mt-4 cursor-pointer text-center'>
            <IoIosRefresh className='mx-auto text-xl' onClick={() => location.reload()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAllList;
