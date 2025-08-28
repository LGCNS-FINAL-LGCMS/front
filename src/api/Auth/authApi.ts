// authApi.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";

// 일단 로그아웃만 만들어둠
export const logoutRequest = async () => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  } catch (error: unknown) {
    const message = error;
    console.error("Logout API error:", message);
    throw message;
  }
};
