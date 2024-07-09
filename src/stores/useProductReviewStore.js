import { create } from "zustand";
import { fetchProductReview } from "../apis";

export const useProductReviewStore = create(set => ({
  reviews: [],
  averageRating: 0,
  fetchReviews: async productId => {
    try {
      const reviews = await fetchProductReview(productId);
      set({ reviews });
      const avgRating =
        reviews.reduce((acc, review) => acc + review.review_score, 0) / reviews.length;
      set({ averageRating: avgRating.toFixed(1) });
    } catch (error) {
      console.error("상품 리뷰 에러 : " + error);
    }
  },
}));

export const SORT_TYPES = {
  LATEST: "latest",
  HIGHEST: "highest",
  LOWEST: "lowest",
};

export const useReviewStore = create(set => ({
  sortType: SORT_TYPES.LATEST,
  setSortType: newSortType => set({ sortType: newSortType }),
}));
