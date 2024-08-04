import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_DB_URL,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
});

// 응답 인터셉터
instance.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

    if (error.response) {
      // 서버 응답이 있는 경우
      switch (error.response.status) {
        case 400:
          errorMessage = "잘못된 요청입니다.";
          break;
        case 401:
          errorMessage = "인증에 실패했습니다. 다시 로그인해 주세요.";
          break;
        case 404:
          errorMessage = "요청한 리소스를 찾을 수 없습니다.";
          break;
        case 500:
          errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
          break;
      }
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      errorMessage = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.";
    }

    // 오류 메시지 표시
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default instance;
