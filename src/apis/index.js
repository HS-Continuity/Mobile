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

// [GET] 인기 검색어 조회
export const fetchPopularKeyword = () => apiGet("/shopping/product/ranking");

// -------------------------[COUPON]-------------------------
// [GET] 회원 쿠폰 조회
export const fetchMemberCoupon = memberId => memberApiGet(`/member-coupon/list`, { memberId });

// -------------------------[MEMBER]-------------------------
// [GET] 회원 정보 조회
export const fetchMemberInfo = memberId => memberApiGet(`/member`, { memberId });

// [GET] 회원 로그인
export const postLogin = memberData => {
  return axios.post("http://localhost:8010/api/auth/login", {
    username: memberData.username,
    password: memberData.password,
  });
};

// Social Login
export const handleSocialLogin = provider => {
  window.location.href = `http://localhost:8010/oauth2/authorization/${provider}`;
};

// [POST] 회원 가입
export const postMember = memberData => {
  console.log(memberData);
  memberApiPost(`/member`, {
    memberId: memberData.memberId,
    memberName: memberData.memberName,
    memberEmail: memberData.memberEmail,
    memberPassword: memberData.memberPassword,
    memberBirthday: memberData.memberBirthday,
    memberPhoneNumber: memberData.memberPhoneNumber,
    gender: memberData.gender,
  });
};

// [POST] 핸드폰으로 문자 전송
export const postMessage = memberPhoneInfo => {
  memberApiPost(`/sms/verification-code`, {
    phoneNumber: memberPhoneInfo.phoneNumber,
    userName: memberPhoneInfo.userName,
  });
};

// [GET] 문자 인증 검증
export const fetchMessageVerify = phoneCode =>
  memberApiGet(`/sms/verify?username=${phoneCode.username}&code=${phoneCode.code}`);

// [POST] 현재 비밀번호 검증
export const verifyPassword = async (memberId, currentPassword) => {
  const response = await axios.post(`/api/member/verify-password`, { memberId, currentPassword });
  return response.data.result;
};

// [POST] 새 비밀번호로 변경
export const changePassword = async ({ memberId, currentPassword, newPassword }) => {
  const response = await axios.post(`/api/member/change-password`, {
    memberId,
    currentPassword,
    newPassword,
  });
  return response.data;
};

// -------------------------[ADDRESS]-------------------------
// [GET] 회원 배송지 조회
export const fetchMemberAddresses = memberId => memberApiGet(`/member-address/list`, { memberId });

// [GET] 회원 배송지 ID 상세 조회
export const fetchMemberAddressDetail = memberAddressId =>
  memberApiGet(`/member-address/${memberAddressId}`);

// [POST] 회원 배송지 등록
export const addAddress = addressData =>
  memberApiPost("/member-address", {
    memberAddressId: addressData.memberAddressId,
    memberId: addressData.memberId,
    addressName: addressData.addressName,
    recipientName: addressData.recipientName,
    recipientPhoneNumber: addressData.recipientPhoneNumber,
    generalAddress: addressData.generalAddress,
    detailAddress: addressData.detailAddress,
    isDefaultAddress: addressData.isDefaultAddress,
  });

// [PUT] 회원 기본 배송지 설정
export const setDefaultAddress = (memberAddressId, memberId) => {
  console.log(memberAddressId);
  console.log(memberId);
  memberApiPut(`/member-address/${memberAddressId}?memberId=${memberId}`);
};

// [DELETE] 회원 배송지 삭제
export const deleteAddress = memberAddressId =>
  memberApiDelete(`/member-address/${memberAddressId}/delete`);

// [PUT] 회원 배송지 수정
export const updateAddress = addressData => {
  memberApiPut(`/member-address/${addressData.memberAddressId}/update`, {
    memberAddressId: addressData.memberAddressId,
    memberId: addressData.memberId,
    addressName: addressData.addressName,
    recipientName: addressData.recipientName,
    recipientPhoneNumber: addressData.recipientPhoneNumber,
    generalAddress: addressData.generalAddress,
    detailAddress: addressData.detailAddress,
    isDefaultAddress: addressData.isDefaultAddress,
  });
};

// -------------------------[CARD]-------------------------
// [GET] 회원 카드 조회
export const fetchMemberCard = memberId => memberApiGet(`/member-payment/list`, { memberId });

// [POST] 회원 카드 등록
export const addMemberCard = cardData =>
  memberApiPost("/member-payment", {
    memberId: cardData.memberId,
    cardCompany: cardData.cardCompany,
    cardNumber: cardData.cardNumber,
    cardPassword: cardData.cardPassword,
    cvcNumber: cardData.cvcNumber,
    cardExpiration: cardData.cardExpiration,
    masterBirthday: cardData.masterBirthday,
    isSimplePaymentAgreed: cardData.isSimplePaymentAgreed,
    isDefaultPaymentCard: cardData.isDefaultPaymentCard,
  });

// [DELETE] 회원 카드 삭제
export const deleteMemberCard = memberPaymentCardId =>
  memberApiDelete(`/member-payment/${memberPaymentCardId}`);

// [PUT] 회원 대표 카드 설정
export const putDefaultCard = (memberPaymentCardId, memberId) => {
  console.log(memberPaymentCardId);
  console.log(memberId);
  memberApiPut(`/member-payment/${memberPaymentCardId}?memberId=${memberId}`);
};

// =================================================================
const API_BASE_URL = "http://localhost:3001";
const DB_URL = "http://localhost:8020/api";

export const createSubscriptionOrder = async orderData => {
  const response = await axios.post(`${API_BASE_URL}/subscriptionOrders`, orderData);
  return response.data;
};

export const getSubscriptionOrderDetails = async orderId => {
  const response = await axios.get(`${API_BASE_URL}/subscriptionOrders/${orderId}`);
  return response.data;
};

// [UPDATE] 회원 정보 수정
export const updateUser = async ({ id, userData }) => {
  const response = await axios.put(`${API_BASE_URL}/member/${id}`, userData);
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
