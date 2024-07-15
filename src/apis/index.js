import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SORT_TYPES } from "../stores/useProductReviewStore";

const API_BASE_URL = "http://localhost:3001";

// [GET] 장바구니 아이템 조회
export const fetchCartItems = async memberId => {
  const response = await axios.get(`${API_BASE_URL}/cart`, {
    params: { member_id: memberId },
  });
  return response.data;
};

// [GET] 장바구니의 마지막 아이템 ID 가져오기
export const getLastCartItemId = async () => {
  const response = await axios.get(`${API_BASE_URL}/cart?_sort=-id&_per_page=1`);
  return response.data[0]?.id || "0";
};

// [UPDATE] 장바구니 아이템 수정
export const updateCartItem = async ({ id, quantity }) => {
  const { data: currentItem } = await axios.get(`${API_BASE_URL}/cart/${id}`);
  const updatedItem = { ...currentItem, quantity };
  const response = await axios.put(`${API_BASE_URL}/cart/${id}`, updatedItem);
  return response.data;
};

// [POST] 장바구니 아이템 추가
export const postToCart = async cartItem => {
  const responseOldData = await fetchCartItems(1);
  const existingCartItem = responseOldData.find(
    item => item.product_id == cartItem.product_id && item.cart_type_id == cartItem.cart_type_id
  );

  if (existingCartItem) {
    const addQuantity = existingCartItem.quantity + cartItem.quantity;
    const response = await updateCartItem({ id: existingCartItem.id, quantity: addQuantity });
    return response.data;
  } else {
    const response = await axios.post(`${API_BASE_URL}/cart`, cartItem);
    return response.data;
  }
};

// [DELETE] 장바구니 아이템 삭제
export const deleteCartItem = async id => {
  const response = await axios.delete(`${API_BASE_URL}/cart/${id}`);
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
      is_page_visibility: true,
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

// [GET] 판매자별 상품 조회
export const fetchCustomerProducts = async customerId => {
  const response = await axios.get(`${API_BASE_URL}/products?customer_id=${customerId}`);
  return response.data;
};

// [GET] 판매자 정보 조회
export const fetchCustomerInfo = async customerId => {
  return {
    name: `판매자 ${customerId}`,
    description: `판매자 ${customerId}에 대한 설명입니다.`,
    image:
      "https://deo.shopeemobile.com/shopee/shopee-edu-live-sg/statickr/img/collection1.4433837.png",
  };
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
