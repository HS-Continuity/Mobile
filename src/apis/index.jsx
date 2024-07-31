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

const API_BASE_URL = "http://localhost:3001";
const DB_URL = "http://localhost:8020/api";
const config = {
  headers: {
    "Content-Type": "application/json",
    credentials: "true",
  },
};

// ========================= CART =========================
export const fetchCartItems = (memberId, cartTypeId) =>
  apiGet("/cart-product", { memberId, cartTypeId });

export const incrementCartItemQuantity = cartProductId =>
  apiPut(`/cart-product/quantity/${cartProductId}/increment`);

export const decrementCartItemQuantity = cartProductId =>
  apiPut(`/cart-product/quantity/${cartProductId}/decrement`);

export const deleteCartItem = cartProductId => apiDelete(`/cart-product/${cartProductId}`);

export const fetchCartItemsCount = (memberId, cartTypeId) =>
  apiGet("/cart-product/count", { memberId, cartTypeId });

export const postCartItem = cartItem => apiPost("/cart-product", cartItem);

export const fetchCustomerDeliveryFee = customerId =>
  apiGet(`/customer/delivery-fee/${customerId}`);

// ========================= CUSTOMER =========================
export const fetchCustomerInfo = customerId => apiGet(`/customer/${customerId}`);

export const fetchCustomerProducts = ({ customerId, pageParam = 0 }) =>
  apiGet(`/shopping/product/customer/${customerId}`, { startPage: pageParam, pageSize: 10 });

export const useCustomerProductsQuery = customerId =>
  useInfiniteQuery({
    queryKey: ["products", customerId],
    queryFn: ({ pageParam = 0 }) => fetchCustomerProducts({ customerId, pageParam }),
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

// ========================= PRODUCT =========================
export const fetchProducts = ({ pageParam = 0 }) =>
  apiGet("/shopping/product/search", { startPage: pageParam, pageSize: 10 });

<<<<<<< HEAD:src/apis/index.js
// [GET] 상품 전체 무한 스크롤 조회
export const useProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["allproducts"],
    queryFn: fetchProducts,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

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
=======
>>>>>>> b226f244e0e80583d448ed574114fbde2f0d1316:src/apis/index.jsx
export const fetchProductDetailImage = productId => apiGet(`/product-image/${productId}`);

export const fetchEcoProductImage = productId =>
  apiGet(`/product-image/certification/${productId}`);

<<<<<<< HEAD:src/apis/index.js
// [GET] 상품 내용 상세 조회
=======
export const useProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
    retry: false,
    throwOnError: () => {},
  });

>>>>>>> b226f244e0e80583d448ed574114fbde2f0d1316:src/apis/index.jsx
export const fetchProductDetail = productId => apiGet(`/shopping/product/${productId}`);

export const fetchLatestProductReviews = productId =>
  apiGet(`/product-review/${productId}`, { pageSize: 3 });

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

<<<<<<< HEAD:src/apis/index.js
// [GET] 인기 검색어 조회
export const fetchPopularKeyword = () => apiGet("/shopping/product/ranking");

// [GET] 광고 상품 조회
export const fetchAdvertisementProductList = async ({ pageParam = 0 }) => {
  const pageSize = 5;
  const response = await axios.get(
    `http://localhost:8020/api/advertisement/product/list?startPage=${pageParam}&pageSize=${pageSize}`
  );
  return response;
};

// -------------------------[COUPON]-------------------------
// [GET] 회원 쿠폰 조회
export const fetchMemberCoupon = memberId => memberApiGet(`/member-coupon/list`, { memberId });

// -------------------------[MEMBER]-------------------------
// [GET] 회원 정보 조회
=======
export const fetchTimeSaleItems = ({ pageParam = 0 }) =>
  apiGet("/time-sale/product/list", { startPage: pageParam, pageSize: 10 });

export const useTimeSaleProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchTimeSaleItems,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

export const fetchSearchItems = ({ keyword, pageParam = 0 }) =>
  apiGet("/shopping/product/search", { keyword, startPage: pageParam, pageSize: 10 });

export const useSearchProductsQuery = keyword =>
  useInfiniteQuery({
    queryKey: ["searchKeywords", keyword],
    queryFn: ({ pageParam = 0 }) => fetchSearchItems({ keyword, pageParam }),
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
  });

export const fetchPopularKeyword = () => apiGet("/shopping/product/ranking");

// ========================= MEMBER =========================
>>>>>>> b226f244e0e80583d448ed574114fbde2f0d1316:src/apis/index.jsx
export const fetchMemberInfo = memberId => memberApiGet(`/member`, { memberId });

export const postLogin = memberData => {
  return axios.post("http://localhost:8010/api/auth/login", {
    username: memberData.username,
    password: memberData.password,
  });
};

<<<<<<< HEAD:src/apis/index.js
// 소셜 로그인
=======
export const fetchMemberCoupon = memberId => memberApiGet(`/member-coupon/list`, { memberId });

>>>>>>> b226f244e0e80583d448ed574114fbde2f0d1316:src/apis/index.jsx
export const handleSocialLogin = provider => {
  window.location.href = `http://localhost:8010/oauth2/authorization/${provider}`;
};

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

export const postMessage = memberPhoneInfo => {
  memberApiPost(`/sms/verification-code`, {
    phoneNumber: memberPhoneInfo.phoneNumber,
    userName: memberPhoneInfo.userName,
  });
};

export const fetchMessageVerify = phoneCode =>
  memberApiGet(`/sms/verify?username=${phoneCode.username}&code=${phoneCode.code}`);

export const verifyPassword = async (memberId, currentPassword) => {
  const response = await axios.post(`/api/member/verify-password`, { memberId, currentPassword });
  return response.data.result;
};

export const changePassword = async ({ memberId, currentPassword, newPassword }) => {
  const response = await axios.post(`/api/member/change-password`, {
    memberId,
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const fetchMemberAddresses = memberId => memberApiGet(`/member-address/list`, { memberId });

export const fetchMemberAddressDetail = memberAddressId =>
  memberApiGet(`/member-address/${memberAddressId}`);

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

export const setDefaultAddress = (memberAddressId, memberId) => {
  console.log(memberAddressId);
  console.log(memberId);
  memberApiPut(`/member-address/${memberAddressId}?memberId=${memberId}`);
};

export const deleteAddress = memberAddressId =>
  memberApiDelete(`/member-address/${memberAddressId}/delete`);

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

export const fetchMemberCard = memberId => memberApiGet(`/member-payment/list`, { memberId });

<<<<<<< HEAD:src/apis/index.js
// [POST] 회원 카드 등록
export const addMemberCard = cardData => {
=======
export const addMemberCard = cardData =>
>>>>>>> b226f244e0e80583d448ed574114fbde2f0d1316:src/apis/index.jsx
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
};

export const deleteMemberCard = memberPaymentCardId =>
  memberApiDelete(`/member-payment/${memberPaymentCardId}`);

export const putDefaultCard = (memberPaymentCardId, memberId) => {
  console.log(memberPaymentCardId);
  console.log(memberId);
  memberApiPut(`/member-payment/${memberPaymentCardId}?memberId=${memberId}`);
};
<<<<<<< HEAD:src/apis/index.js

// -------------------------[ORDER]-------------------------

// [POST] 일반 주문 생성
export const postOrder = async orderData => {
  console.log(orderData);
  try {
    const response = await axios.post(`http://localhost:8040/api/order`, {
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
    const response = await axios.post(
      `http://localhost:8040/api/regular-order`,
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
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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
    `http://localhost:8040/api/order/member-service?memberId=${memberId}&startDate=${startDate}&endDate=${endDate}&page=${pageParam}&size=${size}`
  );
  console.log(response.data);
  return response.data;
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
    `http://localhost:8040/api/regular-order/list?&startDate=${startDate}&endDate=${endDate}&page=${pageParam}&size=${size}`
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
  const response = await axios.get(
    `http://localhost:8040/api/regular-order/${regularOrderId}/detail?`
  );
  return response.data.result;
};

// [PATCH] 주문 취소
export const patchOrderStatus = async (orderId, productId, orderStatusCode) => {
  console.log(orderId.orderStatusCode);
  try {
    const response = await axios.patch(
      `http://localhost:8040/api/order/product/status`,
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
    console.log("Response:", response.data);
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
  const response = await axios.put(
    `http://localhost:8040/api/regular-order/${regularOrderId}/postpone`
  );
  return response;
};

// [PUT] 정기주문 취소하기
export const putSubscriptionOrderCancel = async regularOrderId => {
  const response = await axios.put(
    `http://localhost:8040/api/regular-order/cancel?regularOrderId=${regularOrderId}`
  );
  return response;
};

// [POST] 상품 리뷰 등록
export const postProductReview = async reviewData => {
  console.log(reviewData);

  const formData = new FormData();

  // JSON 데이터 추가
  formData.append(
    "ofRegisterProductReview",
    JSON.stringify({
      productId: reviewData.productId,
      memberId: reviewData.memberId,
      createDate: reviewData.createDate,
      reviewContent: reviewData.reviewContent,
      reviewScore: reviewData.reviewScore,
    })
  );

  // 이미지 파일들 추가
  if (reviewData.reviewImages && reviewData.reviewImages.length > 0) {
    reviewData.reviewImages.forEach((image, index) => {
      formData.append(`reviewImage${index + 1}`, image);
    });
  }

  console.log(formData);
  const response = await axios.post(`http://localhost:8020/api/product-review`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
=======
>>>>>>> b226f244e0e80583d448ed574114fbde2f0d1316:src/apis/index.jsx
