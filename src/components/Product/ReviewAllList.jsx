import React, { useCallback, useEffect, useRef, useState } from "react";
import ReviewBox from "./ReviewBox";
import ReviewListSkeleton from "../Skeletons/ReviewListSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProductReviews } from "../../apis";
import { IoIosRefresh } from "react-icons/io";
import { ReviewEmptyError, ReviewError } from "../Errors/ErrorDisplay";
import { useParams } from "react-router-dom";

const ReviewAllList = ({ productName }) => {
  const { productId } = useParams();
  const observerTarget = useRef(null);
  const [sortOption, setSortOption] = useState("latest");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ["reviews", productId, sortOption],
      queryFn: ({ pageParam = 0 }) => fetchProductReviews(productId, pageParam, sortOption),
      getNextPageParam: lastPage => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
    });

  const handleObserver = useCallback(
    entries => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver]);

  const handleSortChange = e => {
    setSortOption(e.target.value);
    refetch();
  };

  if (isLoading)
    return (
      <div className='mt-28'>
        {[...Array(3)].map((_, i) => (
          <ReviewListSkeleton key={i} />
        ))}
      </div>
    );

  if (isError) return <ReviewError />;
  if (!data || data.pages[0].content.length === 0) return <ReviewEmptyError />;

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center'>
          <h2 className='ml-4 text-xl font-bold'>고객 상품평</h2>
        </div>
        <select
          className='select rounded border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
          value={sortOption}
          onChange={handleSortChange}>
          <option value='latest'>최신순</option>
          <option value='lowRating'>별점 낮은순</option>
          <option value='highRating'>별점 높은순</option>
        </select>
      </div>

      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.content.map(review => (
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
          {isFetchingNextPage && <div className='mt-4 text-center'>더 많은 상품 가져오는중..</div>}
          {!hasNextPage && !isFetchingNextPage && (
            <div className='mt-7 cursor-pointer text-center'>
              <IoIosRefresh className='mx-auto text-xl' onClick={() => window.location.reload()} />
            </div>
          )}
          {hasNextPage && <div ref={observerTarget} className='h-10' />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ReviewAllList;
