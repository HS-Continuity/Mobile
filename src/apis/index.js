import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SORT_TYPES } from "../stores/useProductReviewStore";

const API_BASE_URL = "http://localhost:3001";

// [GET] 장바구니 아이템 조회
export const fetchCartItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/cart`);
  return response.data;
};

// [UPDATE] 장바구니 아이템 수정
export const updateCartItem = async ({ id, quantity }) => {
  const { data: currentItem } = await axios.get(`${API_BASE_URL}/cart/${id}`);
  const updatedItem = { ...currentItem, quantity };
  const response = await axios.put(`${API_BASE_URL}/cart/${id}`, updatedItem);
  return response.data;
};

// 상품 한 번에 조회할 숫자
const ITEMS_PER_PAGE = 5;

// [GET] 상품 목록 조회
const fetchProducts = async ({ pageParam = 1 }) => {
  const response = await axios.get(`${API_BASE_URL}/products`, {
    params: {
      _page: pageParam,
      _per_page: ITEMS_PER_PAGE,
    },
  });

  return response.data;
};

// [GET] 상품 조회(무한 스크롤)
export const useProductsQuery = () => {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: lastPage => {
      if (lastPage.next === null) {
        return undefined;
      }
      return lastPage.next;
    },
    select: data => ({
      pages: data.pages.map(page => page.data),
      pageParams: data.pageParams,
    }),
  });
};

// [GET] 상품 내용 조회
export const fetchProduct = async id => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

// [GET] 상품 ID별 리뷰 조회
export const fetchProductReview = async productId => {
  const response = await axios.get(`${API_BASE_URL}/review?product_id=${productId}`);
  return response.data;
};

// 리뷰 한 번에 볼 숫자
const REVIEWS_PER_PAGE = 5;

// [GET] 상품 ID별 리뷰 조회(무한 스크롤)
const fetchReviews = async ({ pageParam = 1, productId, sortType }) => {
  let params = {
    product_id: productId,
    _page: pageParam,
    _per_page: REVIEWS_PER_PAGE,
  };

  switch (sortType) {
    case SORT_TYPES.LATEST:
      params._sort = "-create_date";
      break;
    case SORT_TYPES.HIGHEST:
      params._sort = "-review_score";
      break;
    case SORT_TYPES.LOWEST:
      params._sort = "review_score";
      break;
    default:
      params._sort = "-create_date";
  }

  const response = await axios.get(`${API_BASE_URL}/review`, { params });
  return response.data;
};

// 리뷰 조회 쿼리 (무한 스크롤)
export const useReviewQuery = (productId, sortType) => {
  return useInfiniteQuery({
    queryKey: ["reviews", productId, sortType],
    queryFn: ({ pageParam }) => fetchReviews({ pageParam, productId, sortType }),
    getNextPageParam: lastPage => {
      if (lastPage.next === null) return undefined;
      const nextPage = lastPage.next ? parseInt(lastPage.next) : undefined;
      return isNaN(nextPage) ? undefined : nextPage;
    },
  });
};
