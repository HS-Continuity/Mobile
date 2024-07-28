import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL;
const MEMBER_DB_URL = import.meta.env.VITE_MEMBER_DB_URL;
const config = import.meta.env.VITE_CONFIG;

// 에러 처리 공통 함수
const handleApiError = (error, customErrorMessage) => {
  console.error(customErrorMessage, error);
  throw error;
};

// API 호출 공통 함수 (baseURL을 파라미터로 받도록 수정)
const apiCall = async (method, url, data = null, params = null, baseURL = DB_URL) => {
  try {
    // const defaultConfig = {
    //   withCredentials: true,
    // };

    const response = await axios({
      method,
      url: `${baseURL}${url}`,
      data,
      params,
      ...config,
    });
    console.log(response);
    return response.data.result;
  } catch (error) {
    handleApiError(error, `API call failed: ${method} ${url}`);
  }
};

// GET 요청 함수
export const apiGet = (url, params, baseURL = DB_URL) => apiCall("get", url, null, params, baseURL);

// POST 요청 함수
export const apiPost = (url, data, baseURL = DB_URL) => apiCall("post", url, data, null, baseURL);

// PUT 요청 함수
export const apiPut = (url, data, baseURL = DB_URL) => apiCall("put", url, data, null, baseURL);

// DELETE 요청 함수
export const apiDelete = (url, baseURL = DB_URL) => apiCall("delete", url, null, null, baseURL);

// MEMBER_DB_URL을 사용하는 API 호출 함수
export const memberApiGet = (url, params) => apiGet(url, params, MEMBER_DB_URL);
export const memberApiPost = (url, data) => apiPost(url, data, MEMBER_DB_URL);
export const memberApiPut = (url, data) => apiPut(url, data, MEMBER_DB_URL);
export const memberApiDelete = url => apiDelete(url, MEMBER_DB_URL);

export { DB_URL, MEMBER_DB_URL, config };
