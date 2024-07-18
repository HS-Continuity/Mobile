import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL;
const config = import.meta.env.VITE_CONFIG;

// [GET] 상품 전체 조회
const fetchProducts = async ({ pageParam = 0 }) => {
  try {
    const response = await axios.get(`${DB_URL}/shopping/product/search`, {
      params: {
        startPage: pageParam,
        pageSize: 10,
      },
    });
    // console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error 상품 전체 조회:", error);
    throw error;
  }
};

// [GET] 상품 전체 무한 스크롤 조회
export const useProductsQuery = () => {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: lastPage => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};

// [GET] 상품 검색
export const fetchSearchItems = async (keyword, page = 0) => {
  try {
    const response = await axios.get(`${DB_URL}/shopping/product/search`, {
      params: {
        keyword,
        startPage: page,
        pageSize: 10,
      },
    });
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error 상품 검색:", error);
    throw error;
  }
};

// [GET] 검색 상품 전체 무한 스크롤 조회
export const useSearchProductsQuery = keyword => {
  return useInfiniteQuery({
    queryKey: ["searchProducts", keyword],
    queryFn: ({ pageParam = 0 }) => fetchSearchItems(keyword, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // 서버 응답에 따라 이 로직을 조정해야 할 수 있습니다
      if (lastPage.content.length < 10 || lastPage.last) {
        return undefined; // 더 이상 페이지가 없음
      }
      return allPages.length; // 다음 페이지 번호
    },
    enabled: !!keyword,
  });
};
// [GET] 상품 내용 상세 조회
export const fetchProductDetail = async productId => {
  try {
    const response = await axios.get(`${DB_URL}/shopping/product/${productId}`);
    // console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error 상품 내용 상세 조회:", error);
    throw error;
  }
};
