// src/api/apiClient.ts
import axios from "axios";
import { API_ENDPOINTS } from "../constants/endpoints";

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";

import type { AppDispatch, RootState } from "../redux/store";
import {
  login,
  logout,
  triggerBan,
  maintenance,
} from "../redux/token/tokenSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL as string;
const REFRESH_URL = API_ENDPOINTS.AUTH.REFRESH;

const handleRefreshFailure = (error: any) => {
  processQueue(error, null);
  handleLogoutForInterceptor();
  return Promise.reject(
    error instanceof Error ? error : new Error("토큰 리프레쉬 실패")
  );
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let storeRef: { getState: () => RootState; dispatch: AppDispatch } | null =
  null;

export const injectStore = (_store: typeof storeRef): void => {
  storeRef = _store;
};

// --- 요청 인터셉터 ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!storeRef) throw new Error("Redux store is not injected.");

    const accessToken = storeRef.getState().token.accessToken;
    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// --- 응답 인터셉터 ---
let isRefreshing = false;

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (err?: any) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

const handleLogoutForInterceptor = (): void => {
  storeRef?.dispatch(logout());
  console.error("User logged out from interceptor due to token issues.");
};

interface RefreshResponse {
  status: string;
  message: string;
  data?: {
    alreadyMember?: boolean;
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<any> => {
    if (!storeRef) return Promise.reject(error);

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const { refreshToken } = storeRef.getState().token;
    const errorMessage = (error.response?.data as { message?: string })
      ?.message;

    // --- 서버에서 강제 밴 ---
    if (
      error.response?.status === 401 &&
      errorMessage === "관리자에 의해 삭제처리된 계정입니다."
    ) {
      storeRef.dispatch(triggerBan());
      return Promise.reject(error);
    }

    // --- 서버 점검 중 ---
    if (
      error.response?.status === 503 &&
      errorMessage === "현재 서버 점검 중입니다."
    ) {
      storeRef.dispatch(maintenance());
      return Promise.reject(error);
    }

    // --- 토큰 갱신 로직 ---
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== REFRESH_URL
    ) {
      if (errorMessage === "로그아웃된 토큰입니다.") {
        handleLogoutForInterceptor();
        return Promise.reject(new Error(errorMessage));
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            if (originalRequest.headers) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!refreshToken) {
        processQueue(new Error("Refresh token not found."), null);
        handleLogoutForInterceptor();
        return Promise.reject(new Error("Refresh token not found."));
      }

      try {
        const refreshResponse = await axios.post<RefreshResponse>(
          `${API_BASE_URL}${REFRESH_URL}`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const responseData = refreshResponse.data;

        if (
          responseData.status === "OK" &&
          responseData.data?.tokens?.accessToken &&
          responseData.data.tokens.refreshToken
        ) {
          const newAccessToken = responseData.data.tokens.accessToken;
          const newRefreshToken = responseData.data.tokens.refreshToken;

          storeRef.dispatch(
            login({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );

          if (originalRequest.headers) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error("Invalid refresh response.");
        }
      } catch (refreshError: any) {
        return handleRefreshFailure(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
