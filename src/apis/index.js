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

const PRODUCT_DB_URL = import.meta.env.VITE_PRODUCT_DB_URL;
const MEMBER_DB_URL = import.meta.env.VITE_MEMBER_DB_URL;
const ORDER_DB_URL = import.meta.env.VITE_ORDER_DB_URL;

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

// [GET] 인기 검색어 조회
export const fetchPopularKeyword = () => apiGet("/shopping/product/ranking");

// [GET] 광고 상품 조회
export const fetchAdvertisementProductList = async ({ pageParam = 0 }) => {
  const pageSize = 5;
  const response = await axios.get(
    `${PRODUCT_DB_URL}/advertisement/product/list?startPage=${pageParam}&pageSize=${pageSize}`
  );
  return response;
};

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
  // return memberApiPost(
  //   "/auth/login",
  //   {
  //     username: memberData.username,
  //     password: memberData.password,
  //   },
  //   true
  // );
};

// 소셜 로그인
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
export const postMessage = async memberPhoneInfo => {
  return memberApiPost(
    `/sms/verification-code`,
    {
      phoneNumber: memberPhoneInfo.phoneNumber,
      userName: memberPhoneInfo.userName,
    },
    true
  );
};

// [GET] 문자 인증 검증
export const fetchMessageVerify = phoneCode =>
  memberApiGet(`/sms/verify?username=${phoneCode.username}&code=${phoneCode.code}`);

// [POST] 현재 비밀번호 검증
export const verifyPassword = async (memberId, currentPassword) => {
  const response = await memberApiPost(
    "/member/verify-password",
    { memberId, currentPassword },
    true
  );
  return response.data.result;
};

// [POST] 새 비밀번호로 변경
export const changePassword = async ({ memberId, currentPassword, newPassword }) => {
  const response = await axios.post(`${MEMBER_DB_URL}/member/change-password`, {
    memberId,
    currentPassword,
    newPassword,
  });
  return response.data;
};

// [GET] 아이디 중복 검사
export const verifyMemberId = memberId => memberApiGet(`/member/check-id`, { memberId });

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
export const addMemberCard = cardData => {
  console.log(cardData);
  return memberApiPost("/member-payment", {
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
};

// [DELETE] 회원 카드 삭제
export const deleteMemberCard = memberPaymentCardId =>
  memberApiDelete(`/member-payment/${memberPaymentCardId}`);

// [PUT] 회원 대표 카드 설정
export const putDefaultCard = (memberPaymentCardId, memberId) => {
  console.log(memberPaymentCardId);
  console.log(memberId);
  memberApiPut(`/member-payment/${memberPaymentCardId}?memberId=${memberId}`);
};

// -------------------------[ORDER]-------------------------

// [POST] 일반 주문 생성
export const postOrder = async orderData => {
  console.log(orderData);
  try {
    const response = await axios.post(`${ORDER_DB_URL}/order`, {
      customerId: orderData.customerId,
      memberCouponId: orderData.memberCouponId,
      storeName: orderData.storeName,
      productOrderList: {
        productOrderList: orderData.productOrderList.productOrderList.map(item => ({
          productId: item.productId,
          name: item.name,
          originPrice: item.originPrice,
          discountAmount: item.discountAmount,
          finalPrice: item.finalPrice,
          quantity: item.quantity,
          status: item.status,
        })),
      },
      recipient: orderData.recipient,
      originProductAmount: orderData.originProductAmount,
      totalDiscountAmount: orderData.totalDiscountAmount,
      paymentAmount: orderData.paymentAmount,
      deliveryFee: orderData.deliveryFee,
      orderMemo: orderData.orderMemo,
      paymentCardId: orderData.paymentCardId,
    });
    return {
      success: response.data.resultCode == "200",
      data: response.data,
    };
  } catch (error) {
    console.error("Order request failed:", error);
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

// [POST] 정기 주문 생성
export const postSubscriptionOrder = async orderData => {
  try {
    const response = await orderApiPost(
      "/regular-order",
      {
        customerId: orderData.customerId,
        memberId: orderData.memberId,
        memberCouponId: orderData.memberCouponId,
        orderMemo: orderData.orderMemo,
        paymentCardId: orderData.paymentCardId,
        productOrderList: orderData.productOrderList,
        deliveryPeriod: orderData.deliveryPeriod,
        recipient: orderData.recipient,
      },
      true
    );

    return {
      success: response.data.resultCode === "200",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

// [GET] 일반 주문 목록 조회
export const fetchMemberOrderList = async ({ memberId, startDate, endDate, pageParam = 0 }) => {
  const size = 10;
  const response = await axios.get(
    `${ORDER_DB_URL}/order/member-service?memberId=${memberId}&startDate=${startDate}&endDate=${endDate}&page=${pageParam}&size=${size}`
  );
  console.log(response.data);
  return response.data;
};

// [GET] 일반 주문 상세 조회
export const fetchMemberOrderDetail = async orderDetailId => {
  return orderApiGet(`/order/member-service/${orderDetailId}`, null, true);
  // console.log(orderDetailId);
  // const response = await axios.get(
  //   `http://localhost:8040/orderservice/api/order/member-service/${orderDetailId}`
  // );
  // return response;
};

// [GET] 일반 주문 목록 조회 무한 스크롤링
export const useOrderListQuery = ({ memberId, startDate, endDate }) =>
  useInfiniteQuery({
    queryKey: ["orderlist", memberId, startDate, endDate],
    queryFn: ({ pageParam = 0 }) =>
      fetchMemberOrderList({ memberId, startDate, endDate, pageParam }),
    getNextPageParam: lastPage => (lastPage.result.last ? undefined : lastPage.result.number + 1),
  });

// [GET] 정기 주문 목록 조회
export const fetchMemberSubscriptionList = async ({ startDate, endDate, pageParam = 0 }) => {
  const size = 10;
  const response = await axios.get(
    `${ORDER_DB_URL}/regular-order/list?&startDate=${startDate}&endDate=${endDate}&page=${pageParam}&size=${size}`
  );
  return response.data;
};

// [GET] 정기 주문 목록 조회 무한 스크롤링
export const useSubscriptionOrderListQuery = ({ startDate, endDate }) =>
  useInfiniteQuery({
    queryKey: ["subscriptionorderlist"],
    queryFn: ({ pageParam = 0 }) => fetchMemberSubscriptionList({ startDate, endDate, pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.result.number + 1;
      return nextPage < lastPage.result.totalPages ? nextPage : undefined;
    },
  });

// [GET] 정기 주문 상세 조회
export const fetchMemberSubscriptionDetail = async regularOrderId => {
  const response = await axios.get(`${ORDER_DB_URL}/regular-order/${regularOrderId}/detail`);
  return response.data.result;
};

// [PATCH] 주문 취소
// export const patchOrderStatus = async (orderId, productId, orderStatusCode) => {
export const patchOrderStatus = async orderId => {
  try {
    const response = await axios.patch(
      `${ORDER_DB_URL}/order/product/status`,
      {
        orderId: orderId.orderId,
        productId: orderId.productId,
        orderStatusCode: orderId.orderStatusCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in patchOrderStatus:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// [PUT] 정기주문 회차 미루기
export const putSubscriptionOrderPostpone = async regularOrderId => {
  return orderApiPut(`/regular-order/${regularOrderId}/postpone`, true);
};

// [PUT] 정기주문 취소하기
export const putSubscriptionOrderCancel = async regularOrderId => {
  return orderApiPut(`/regular-order/cancel?regularOrderId=${regularOrderId}`, true);
};

// [POST] 상품 리뷰 등록
export const postProductReview = async reviewData => {
  const formData = new FormData();

  // ofRegisterProductReview 객체를 직접 추가
  formData.append(
    "ofRegisterProductReview",
    new Blob([JSON.stringify(reviewData.ofRegisterProductReview)], {
      type: "application/json",
    })
  );

  // 이미지 추가
  if (reviewData.image) {
    formData.append("image", reviewData.image);
  }

  const response = await axios.post(`${PRODUCT_DB_URL}/product-review`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
