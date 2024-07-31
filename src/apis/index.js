import axios from "axios";
import {
  apiGet,
  apiPut,
  apiDelete,
  apiPost,
  memberApiGet,
  memberApiPost,
  memberApiPut,
  memberApiDelete,
  orderApiDelete,
  orderApiGet,
  orderApiPost,
  orderApiPut,
} from "./apiUtils";
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
// 트래픽 몰리는 시간대
const isHighTrafficTime = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 (일요일) 부터 6 (토요일)

  // 점심 시간 (11:00 - 14:00)
  const isLunchTime = hour >= 11 && hour < 14;

  // 저녁 시간 (17:00 - 20:00)
  const isDinnerTime = hour >= 17 && hour < 20;

  // 주말 오전 (토,일 10:00 - 13:00)
  const isWeekendMorning = (day === 0 || day === 6) && hour >= 10 && hour < 13;

  // 금요일 저녁 (금요일 17:00 이후)
  const isFridayEvening = day === 5 && hour >= 17;

  return isLunchTime || isDinnerTime || isWeekendMorning || isFridayEvening;
};

// [GET] 상품 전체 조회
const fetchProducts = ({ pageParam = 0 }) =>
  apiGet("/shopping/product/search", { startPage: pageParam, pageSize: 10 });

// [GET] 상품 전체 무한 스크롤 조회
export const useProductsQuery = () => {
  const isHighTraffic = isHighTrafficTime();
  const staleTime = isHighTraffic ? 5 * 60 * 1000 : 30 * 60 * 1000; // 5분 또는 30분
  const cacheTime = isHighTraffic ? 10 * 60 * 1000 : 60 * 60 * 1000; // 10분 또는 60분

  return useInfiniteQuery({
    queryKey: ["allproducts"],
    queryFn: fetchProducts,
    staleTime: staleTime,
    cacheTime: cacheTime,
    keepPreviousData: true,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// [GET] 일반 상품 전체 조회
export const fetchGeneralItems = ({ pageParam = 0 }) =>
  apiGet("/shopping/product/search", {
    isCertification: "INACTIVE",
    startPage: pageParam,
    pageSize: 10,
  });

// [GET] 일반 상품 전체 무한 스크롤 조회
export const useGeneralProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["generalproducts"],
    queryFn: fetchGeneralItems,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

// [GET] 친환경 상품 전체 조회
export const fetchEcolItems = ({ pageParam = 0 }) =>
  apiGet("/shopping/product/search", {
    isCertification: "ACTIVE",
    startPage: pageParam,
    pageSize: 10,
  });

// [GET] 친환경 상품 전체 무한 스크롤 조회
export const useEcoProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["ecoproducts"],
    queryFn: fetchEcolItems,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

// [GET] 타임세일 상품 전체 조회
export const fetchTimeSaleItems = ({ pageParam = 0 }) =>
  apiGet("/time-sale/product/list", { startPage: pageParam, pageSize: 10 });

// [GET] 타임세일 상품 전체 무한 스크롤 조회
export const useTimeSaleProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["timesaleproducts"],
    queryFn: fetchTimeSaleItems,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

// [GET] 타임세일 상품 전체 조회
export const fetchTimeSaleItemDetail = timesaleId => apiGet(`/time-sale/${timesaleId}/product`);

// [GET] 검색 상품 조회
export const fetchSearchItems = ({ keyword, pageParam = 0 }) =>
  apiGet("/shopping/product/search", { keyword, startPage: pageParam, pageSize: 10 });

// [GET] 검색 상품 전체 무한 스크롤 조회
export const useSearchProductsQuery = keyword =>
  useInfiniteQuery({
    queryKey: ["searchKeywords", keyword],
    queryFn: ({ pageParam = 0 }) => fetchSearchItems({ keyword, pageParam }),
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
    retry: 1,
  });

// [GET] 상품 상세 이미지 조회
export const fetchProductDetailImage = productId => apiGet(`/product-image/${productId}`);

// [GET] 친환경 상품 인증서 이미지 조회
export const fetchEcoProductImage = productId =>
  apiGet(`/product-image/certification/${productId}`);

// [GET] 상품 내용 상세 조회
export const fetchProductDetail = productId => apiGet(`/shopping/product/${productId}`);

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
const config = {
  headers: {
    "Content-Type": "application/json",
    credentials: "true",
  },
};

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

// [GET] 회원 쿠폰 조회
export const fetchMemberCoupon = async memberId => {
  const response = await axios.get(`${API_BASE_URL}/coupon`, {
    params: {
      member_id: memberId,
    },
  });
  return response.data;
// Social Login
export const handleSocialLogin = provider => {
  window.location.href = `http://localhost:8010/oauth2/authorization/${provider}`;
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

// [GET] 회원 주문 조회
export const fetchOrders = async memberId => {
  const response = await axios.get("http://localhost:3001/order", {
    params: {
      member_id: memberId,
    },
  });
  return response.data;
};
