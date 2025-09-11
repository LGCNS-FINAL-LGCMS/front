// authApi.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

export const logoutRequest = async () => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "로그아웃 실패");
    console.error("LogOut API error:", message);

    throw new Error(message);
  }
};

export const signoutRequest = async () => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGN_OUT);
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "회원 탈퇴 실패");
    throw new Error(message);
  }
};
