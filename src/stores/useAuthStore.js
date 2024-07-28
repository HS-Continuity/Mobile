import { create } from "zustand";
import axios from "axios";
import base64 from "base-64";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const useAuthStore = create(set => ({
  token: null,
  username: null,
  isAuthenticated: false,
  login: async loginData => {
    try {
      const response = await axios.post("http://localhost:8010/api/auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log(response);
      const authHeader = response.headers["authorization"]; // Bearer 포함

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7); // "Bearer " 이후의 문자열 추출

        const payload = JSON.parse(base64.decode(token.split(".")[1]));

        const username = payload.username;

        console.log(username);
        set({ accessToken: authHeader, username: username, isAuthenticated: true });

        // 향후 요청에 대한 기본 헤더 설정
        axios.defaults.headers.common["Authorization"] = authHeader;

        return true;
      } else {
        console.error("No valid Authorization header found");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      return false;
    }
  },
  logout: async () => {
    try {
      await axios.post("http://localhost:8010/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    set({ accessToken: null, username: null, isAuthenticated: false });
    delete axios.defaults.headers.common["Authorization"];
  },
  refreshToken: async () => {
    try {
      const response = await axios.post(
        "http://localhost:8010/api/access-token",
        {},
        {
          withCredentials: true,
        }
      );
      const authHeader = response.headers["authorization"]; // Bearer 포함

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7); // "Bearer " 이후의 문자열 추출

        const payload = JSON.parse(base64.decode(token.split(".")[1]));

        const username = payload.username;

        console.log(username);
        set({ accessToken: token, username: username, isAuthenticated: true });

        // 향후 요청에 대한 기본 헤더 설정
        axios.defaults.headers.common["Authorization"] = authHeader;

        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      set({ accessToken: null, username: null, isAuthenticated: false });
      delete axios.defaults.headers.common["Authorization"];
      return false;
    }
  },
  setupInterceptors: () => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(token => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                return axios(originalRequest);
              })
              .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          return new Promise((resolve, reject) => {
            get()
              .refreshToken()
              .then(token => {
                if (token) {
                  processQueue(null, token);
                  resolve(axios(originalRequest));
                } else {
                  processQueue(new Error("Failed to refresh token"));
                  reject(error);
                }
              })
              .catch(err => {
                processQueue(err);
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        }

        return Promise.reject(error);
      }
    );
  },
}));

export default useAuthStore;
