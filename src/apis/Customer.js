import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL;

// [GET] 판매자 정보 조회
export const fetchCustomerInfo = async customerId => {
  try {
    const response = await axios.get(`${DB_URL}/customer/${customerId}`);
    return response.data.result;
  } catch (error) {
    console.error("Error 판매자 정보 조회:", error);
    throw error;
  }
};

// [GET] 판매자별 상품 조회
export const fetchCustomerProducts = async ({ customerId, pageParam = 0 }) => {
  try {
    const response = await axios.get(`${DB_URL}/shopping/product/customer/${customerId}`, {
      params: {
        startPage: pageParam,
        pageSize: 10,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error 판매자 상품 정보 조회:", error);
    throw error;
  }
};

// [GET] 판매자 상품 전체 무한 스크롤 조회
export const useCustomerProductsQuery = customerId => {
  return useInfiniteQuery({
    queryKey: ["products", customerId],
    queryFn: ({ pageParam = 0 }) => fetchCustomerProducts({ customerId, pageParam }),
    getNextPageParam: lastPage => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};
