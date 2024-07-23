import axios from "axios";
import { apiGet, apiPut, apiDelete, apiPost } from "./apiUtils";
import { useInfiniteQuery } from "@tanstack/react-query";

// -------------------------[CART]-------------------------
// [GET] 장바구니 아이템 조회
export const fetchCartItems = (memberId, cartTypeId) =>
  apiGet("/cart-product", { memberId, cartTypeId });

// [PUT] 장바구니 상품 개수 증가
export const incrementCartItemQuantity = cartProductId =>
  apiPut(`/cart-product/quantity/${cartProductId}/increment`);

// [PUT] 장바구니 상품 개수 감소
export const decrementCartItemQuantity = cartProductId =>
  apiPut(`/cart-product/quantity/${cartProductId}/decrement`);

// [DELETE] 장바구니 상품 삭제
export const deleteCartItem = cartProductId => apiDelete(`/cart-product/${cartProductId}`);

// [GET] 장바구니 탭마다 상품 수량 조회
export const fetchCartItemsCount = (memberId, cartTypeId) =>
  apiGet("/cart-product/count", { memberId, cartTypeId });

// [POST] 장바구니 등록
export const postCartItem = cartItem => apiPost("/cart-product", cartItem);

// [GET] 장바구니 판매자별 배송비 조회
export const fetchCustomerDeliveryFee = customerId =>
  apiGet(`/customer/delivery-fee/${customerId}`);

// -------------------------[CUSTOMER]-------------------------
// [GET] 판매자 정보 조회
export const fetchCustomerInfo = customerId => apiGet(`/customer/${customerId}`);

// [GET] 판매자별 상품 조회
export const fetchCustomerProducts = ({ customerId, pageParam = 0 }) =>
  apiGet(`/shopping/product/customer/${customerId}`, {
    startPage: pageParam,
    pageSize: 10,
  });

// [GET] 판매자 상품 전체 무한 스크롤 조회
export const useCustomerProductsQuery = customerId =>
  useInfiniteQuery({
    queryKey: ["products", customerId],
    queryFn: ({ pageParam = 0 }) => fetchCustomerProducts({ customerId, pageParam }),
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

// -------------------------[PRODUCT]-------------------------
// [GET] 상품 전체 조회
const fetchProducts = ({ pageParam = 0 }) =>
  apiGet("/shopping/product/search", { startPage: pageParam, pageSize: 10 });

// [GET] 상품 상세 이미지 조회
export const fetchProductDetailImage = productId => apiGet(`/product-image/${productId}`);

// [GET] 친환경 상품 인증서 이미지 조회
export const fetchEcoProductImage = productId =>
  apiGet(`/product-image/certification/${productId}`);

// [GET] 상품 전체 무한 스크롤 조회
export const useProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
    retry: false,
    throwOnError: () => {},
  });

// [GET] 상품 내용 상세 조회
export const fetchProductDetail = productId => apiGet(`/shopping/product/${productId}`);

// [GET] 상품별 리뷰 조회
export const fetchLatestProductReviews = productId =>
  apiGet(`/product-review/${productId}`, { pageSize: 3 });

// [GET] 상품 리뷰 전체 조회
export const fetchProductReviews = (productId, startPage = 0, sortOption = "latest") => {
  const sortParams = {
    lowRating: { sort: "reviewScore", direction: "asc" },
    highRating: { sort: "reviewScore", direction: "desc" },
    latest: { sort: "createDate", direction: "desc" },
  };
  const { sort, direction } = sortParams[sortOption] || sortParams.latest;

  return apiGet(`/product-review/${productId}`, {
    startPage,
    pageSize: 10,
    sort,
    direction,
  });
};

// [GET] 검색 상품 조회
export const fetchSearchItems = ({ keyword, pageParam = 0 }) =>
  apiGet("/shopping/product/search", { keyword, startPage: pageParam, pageSize: 10 });

// [GET] 검색 상품 전체 무한 스크롤 조회
export const useSearchProductsQuery = keyword =>
  useInfiniteQuery({
    queryKey: ["searchKeywords", keyword],
    queryFn: ({ pageParam = 0 }) => fetchSearchItems({ keyword, pageParam }),
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

// [GET] 타임세일 상품 전체 조회
export const fetchTimeSaleItems = ({ pageParam = 0 }) =>
  apiGet("/time-sale/product/list", { startPage: pageParam, pageSize: 10 });

// [GET] 타임세일 상품 전체 무한 스크롤 조회
export const useTimeSaleProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchTimeSaleItems,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

// [GET] 인기 검색어 조회
export const fetchPopularKeyword = () => apiGet("/shopping/product/ranking");

// =================================================================
const API_BASE_URL = "http://localhost:3001";
const DB_URL = "http://localhost:8020/api";
const config = {
  headers: {
    "Content-Type": "application/json",
    credentials: "true",
  },
};

export const createSubscriptionOrder = async orderData => {
  const response = await axios.post(`${API_BASE_URL}/subscriptionOrders`, orderData);
  return response.data;
};

export const getSubscriptionOrderDetails = async orderId => {
  const response = await axios.get(`${API_BASE_URL}/subscriptionOrders/${orderId}`);
  return response.data;
};

// [GET] 회원 쿠폰 조회
export const fetchMemberCoupon = async memberId => {
  const response = await axios.get(`${API_BASE_URL}/coupon`, {
    params: {
      member_id: memberId,
    },
  });
  return response.data;
};

// [GET] 회원 정보 조회
export const fetchMemberInfo = async memberId => {
  const response = await axios.get(`${API_BASE_URL}/member`, {
    params: { member_id: memberId },
  });
  return response.data;
};

// [GET] 회원 주소 정보 조회
export const fetchMemberAddresses = async memberId => {
  const response = await axios.get(`${API_BASE_URL}/address`, {
    params: { member_id: memberId },
  });
  return response.data;
};

// [POST] 회원 주소지 추가
export const addAddress = async ({ memberId, general_address, detail_address }) => {
  const newAddress = {
    member_id: memberId,
    general_address,
    detail_address,
    is_default_address: false,
  };

  const response = await axios.post(`${API_BASE_URL}/address`, newAddress);
  return response.data;
};

// [PUT] 회원 주소지 수정
export const updateAddress = async ({
  id,
  general_address,
  detail_address,
  is_default_address,
}) => {
  const response = await axios.put(`${API_BASE_URL}/address/${id}`, {
    general_address,
    detail_address,
    is_default_address,
  });
  return response.data;
};

// [DELETE] 회원 주소지 삭제
export const deleteAddress = async id => {
  const response = await axios.delete(`${API_BASE_URL}/address/${id}`);
  return response.data;
};

// [PATCH] 회원 대표 주소지 설정
export const setDefaultAddress = async ({ memberId, addressId }) => {
  const allAddresses = await fetchMemberAddresses(memberId);
  for (let address of allAddresses) {
    if (address.is_default_address) {
      await axios.patch(`${API_BASE_URL}/address/${address.id}`, {
        is_default_address: false,
      });
    }
  }

  const response = await axios.patch(`${API_BASE_URL}/address/${addressId}`, {
    is_default_address: true,
  });
  return response.data;
};

// [GET] 회원별 카드 정보 조회
export const fetchMemberCard = async memberId => {
  const response = await axios.get(`${API_BASE_URL}/card`, {
    params: {
      member_id: memberId,
    },
  });

  return response.data;
};

// [POST] 회원 카드 추가
export const addMemberCard = async ({ memberId, ...cardData }) => {
  const response = await axios.post(`${API_BASE_URL}/card`, {
    member_id: memberId,
    ...cardData,
  });
  return response.data;
};

// [PUT] 회원 카드 수정
export const updateMemberCard = async ({ memberId, id, ...cardData }) => {
  if (!id) {
    throw new Error("Card ID is required for updating");
  }
  const response = await axios.put(`${API_BASE_URL}/card/${id}`, {
    member_id: memberId,
    ...cardData,
  });
  return response.data;
};

// [DELETE] 회원 카드 삭제
export const deleteMemberCard = async ({ memberId, cardId }) => {
  const response = await axios.delete(`${API_BASE_URL}/card/${cardId}`);
  return response.data;
};

// [UPDATE] 회원 정보 수정
export const updateUser = async ({ id, userData }) => {
  const response = await axios.put(`${API_BASE_URL}/member/${id}`, userData);
  return response.data;
};

// [GET] 회원 쿠폰 조회
export const fetchCoupons = async memberId => {
  const response = await axios.get(`${API_BASE_URL}/coupon?member_id=${memberId}`);
  return response.data;
};

// [GET] 회원 주문 조회
export const fetchOrders = async memberId => {
  const response = await axios.get("http://localhost:3001/order", {
    params: {
      member_id: memberId,
    },
  });
  return response.data;
};
