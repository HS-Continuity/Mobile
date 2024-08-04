import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL;
const MEMBER_DB_URL = import.meta.env.VITE_MEMBER_DB_URL;
const ORDER_DB_URL = import.meta.env.VITE_ORDER_DB_URL;
const config = import.meta.env.VITE_CONFIG;

// 에러 처리 공통 함수
const handleApiError = (error, customErrorMessage) => {
  console.error(customErrorMessage, error);
  throw error;
};

// API 호출 공통 함수
const apiCall = async (
  method,
  url,
  data = null,
  params = null,
  baseURL = DB_URL,
  fullResponse = false
) => {
  try {
    const response = await axios({
      method,
      url: `${baseURL}${url}`,
      data,
      params,
      ...config,
    });
    console.log(response);
    return fullResponse ? response : response.data.result;
  } catch (error) {
    handleApiError(error, `API call failed: ${method} ${url}`);
  }
};

// DB_URL(상품)을 사용하는 API 호출 함수
export const apiGet = (url, params, baseURL = DB_URL, fullResponse = false) =>
  apiCall("get", url, null, params, baseURL, fullResponse);
export const apiPost = (url, data, baseURL = DB_URL, fullResponse = false) =>
  apiCall("post", url, data, null, baseURL, fullResponse);
export const apiPut = (url, data, baseURL = DB_URL, fullResponse = false) =>
  apiCall("put", url, data, null, baseURL, fullResponse);
export const apiDelete = (url, baseURL = DB_URL, fullResponse = false) =>
  apiCall("delete", url, null, null, baseURL, fullResponse);

// MEMBER_DB_URL을 사용하는 API 호출 함수
export const memberApiGet = (url, params, fullResponse = false) =>
  apiGet(url, params, MEMBER_DB_URL, fullResponse);
export const memberApiPost = (url, data, fullResponse = false) =>
  apiPost(url, data, MEMBER_DB_URL, fullResponse);
export const memberApiPut = (url, data, fullResponse = false) =>
  apiPut(url, data, MEMBER_DB_URL, fullResponse);
export const memberApiDelete = (url, fullResponse = false) =>
  apiDelete(url, MEMBER_DB_URL, fullResponse);

// ORDER_DB_URL을 사용하는 API 호출 함수
export const orderApiGet = (url, params, fullResponse = false) =>
  apiGet(url, params, ORDER_DB_URL, fullResponse);
export const orderApiPost = (url, data, fullResponse = false) =>
  apiPost(url, data, ORDER_DB_URL, fullResponse);
export const orderApiPut = (url, data, fullResponse = false) =>
  apiPut(url, data, ORDER_DB_URL, fullResponse);
export const orderApiDelete = (url, fullResponse = false) =>
  apiDelete(url, ORDER_DB_URL, fullResponse);

export { DB_URL, MEMBER_DB_URL, ORDER_DB_URL, config };
