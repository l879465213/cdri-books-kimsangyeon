import { getItem, clearLocalStorage, setItem } from "@/shared/utils";
// import { appRoutes } from "@/config/path/routes";
import axios from "axios";

export const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // withCredentials: true, // refresh token을 위해 필요
});

// axios 인스턴스를 가져와 API 호출에 사용할 때마다 헤더가 Authorization자동으로 인터셉터에 포함됩니다
axiosClient.interceptors.request.use(
  async (config) => {
    const token = getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token?.accessToken || ""}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 서버의 모든 응답을 가로채서 엑세스 토큰이 만료되어 response 로 새롭게 받아온 토큰으로 교체
axiosClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    // const currentPath = window.location.pathname; // 현재 경로를 가져옴
    const originalConfig = err.config; // 에러난 api 요청 정보

    // 네트워크 오류
    // if (err.code === "ERR_NETWORK") {
    //   // 네트워크 오류 처리
    //   return Promise.reject(err);
    // }

    // 토큰 만료 에러 처리
    if (err.response?.status === 401) {
      // 로그인 페이지일 경우 토큰 갱신 시도하지 않음
      // if (currentPath === appRoutes.login) {
      //   return Promise.reject(err);
      // }

      // 이미 재시도한 경우는 다시 시도하지 않음
      if (originalConfig._retry) {
        clearLocalStorage();
        // window.location.href = appRoutes.error + "?expired=true&from=" + currentPath;
        return Promise.reject(err);
      }

      // 재시도 플래그 설정
      originalConfig._retry = true;

      try {
        // localStorage에서 refresh token 검증
        const tokens = getItem("token");
        if (!tokens?.refreshToken) {
          throw new Error("No refresh token");
        }

        let newAccessToken = "";
        let newRefreshToken = "";

        // 1. api 요청 으로 token 재발급 해야할 경우
        const response = await axios.post(
          `${import.meta.env.VITE_AUTH_URL}/v1/auth/refresh`,
          {},
          {
            headers: {
              "X-Refresh-Token": tokens.refreshToken,
            },
          }
        );
        // 새로운 토큰 저장
        newAccessToken = response.data?.data?.accessToken;
        newRefreshToken = response.data?.data?.refreshToken;

        // 2. token 만료시 response에 refresh token 에러 메시지 담겨있는 경우
        if (err.response?.data?.error) {
          newAccessToken = err.response.data.error.accessToken;
          newRefreshToken = err.response.data.error.refreshToken;
        }

        if (newAccessToken) {
          setItem("token", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          // 실패했던 원래 요청 다시 시도
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalConfig);
        } else {
          throw new Error("failed to get new access token");
        }
      } catch (refreshError) {
        // refresh token도 만료되었거나 갱신 실패한 경우 로그아웃
        clearLocalStorage();
        // window.location.href = appRoutes.root + "?expired=true&from=" + currentPath;
        return Promise.reject(refreshError);
      }
    } else if (err.response.status === 404 || err.response.status === 500) {
      // 서버 에러 처리
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);
