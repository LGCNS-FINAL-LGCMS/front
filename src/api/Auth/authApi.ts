// authApi.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";

// 일단 로그아웃만 만들어둠
export const logoutRequest = async (): Promise<any> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "로그아웃 실패";
    console.error("Logout API error:", message);
    throw new Error(message);
  }
};
