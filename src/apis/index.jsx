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

export const fetchProductDetailImage = productId => apiGet(`/product-image/${productId}`);

export const fetchEcoProductImage = productId =>
  apiGet(`/product-image/certification/${productId}`);

export const useProductsQuery = () =>
  useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.number + 1),
    retry: false,
    throwOnError: () => {},
  });

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
export const fetchMemberInfo = memberId => memberApiGet(`/member`, { memberId });

export const postLogin = memberData => {
  return axios.post("http://localhost:8010/api/auth/login", {
    username: memberData.username,
    password: memberData.password,
  });
};

export const fetchMemberCoupon = memberId => memberApiGet(`/member-coupon/list`, { memberId });

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

export const deleteMemberCard = memberPaymentCardId =>
  memberApiDelete(`/member-payment/${memberPaymentCardId}`);

export const putDefaultCard = (memberPaymentCardId, memberId) => {
  console.log(memberPaymentCardId);
  console.log(memberId);
  memberApiPut(`/member-payment/${memberPaymentCardId}?memberId=${memberId}`);
};
