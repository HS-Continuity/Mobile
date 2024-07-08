import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

// [GET] 장바구니 아이템 조회
export const fetchCartItems = async () => {
  const response = await axios.get("http://localhost:3001/cart");
  return response.data;
};

// [UPDATE] 장바구니 아이템 수정
export const updateCartItem = async ({ id, quantity }) => {
  const { data: currentItem } = await axios.get(`http://localhost:3001/cart/${id}`);
  const updatedItem = { ...currentItem, quantity };
  const response = await axios.put(`http://localhost:3001/cart/${id}`, updatedItem);
  return response.data;
};

// 상품 한 번에 조회할 숫자
const ITEMS_PER_PAGE = 5;

// [GET] 상품 조회
const fetchProducts = async ({ pageParam = 1 }) => {
  const response = await axios.get(`http://localhost:3001/products`, {
    params: {
      _page: pageParam,
      _per_page: ITEMS_PER_PAGE,
    },
  });

  return response.data;
};

// [GET] 상품 무한 스크롤링 조회
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
