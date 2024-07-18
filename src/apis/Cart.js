import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL;
const config = import.meta.env.VITE_CONFIG;

// [GET] 장바구니 아이템 조회
export const fetchCartItems = async (memberId, cartTypeId) => {
  try {
    const response = await axios.get(`${DB_URL}/cart-product`, {
      params: { memberId, cartTypeId },
      config,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// [PUT] 장바구니 상품 개수 증가
export const incrementCartItemQuantity = async cartProductId => {
  try {
    const response = await axios.put(`${DB_URL}/cart-product/quantity/${cartProductId}/increment`);
    return response.data;
  } catch (error) {
    console.error("Error 장바구니 개수 증가:", error);
    throw error;
  }
};

// [PUT] 장바구니 상품 개수 감소
export const decrementCartItemQuantity = async cartProductId => {
  try {
    const response = await axios.put(`${DB_URL}/cart-product/quantity/${cartProductId}/decrement`);
    return response.data;
  } catch (error) {
    console.error("Error 장바구니 개수 감소:", error);
    throw error;
  }
};

// [DELETE] 장바구니 상품 삭제
export const deleteCartItem = async cartProductId => {
  try {
    const response = await axios.delete(`${DB_URL}/cart-product/${cartProductId}`);
    return response.data;
  } catch (error) {
    console.error("Error 장바구니 상품 삭제:", error);
    throw error;
  }
};

// [GET] 장바구니 탭마다 상품 수량 조회
export const fetchCartItemsCount = async (memberId, cartTypeId) => {
  try {
    const response = await axios.get(`${DB_URL}/cart-product/count`, {
      params: {
        memberId,
        cartTypeId,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error 장바구니 개수 조회:", error);
    throw error;
  }
};

// [POST] 장바구니 등록
export const postCartItem = async cartItem => {
  try {
    const response = await axios.post(`${DB_URL}/cart-product`, cartItem);
    return response.data.result;
  } catch (error) {
    console.error("Error 장바구니 추가 실패:", error);
    throw error;
  }
};

// [GET] 장바구니 판매자별 배송비 조회
export const fetchCustomerDeliveryFee = async customerId => {
  try {
    const response = await axios.get(`${DB_URL}/customer/delivery-fee/${customerId}`, {});
    // console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error 장바구니 판매자 배송비 조회:", error);
    throw error;
  }
};
