import axios from "axios";
import { API_ENDPOINTS } from "../../constants/endpoints";
import type { LoginResponse } from "../../types/authInfo";

export interface GoogleLoginRequest {
  idTokenString: string; // 구글에서 받은 JWT 토큰
}

export const googleLoginAPI = async (
  idTokenString: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_API_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`,
      { idTokenString },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("로그인 API 응답 성공!", response?.data);
    return response.data;
  } catch (error: any) {
    console.log("로그인 서버응답 실패", error);
    const errorMessage =
      error.response?.data?.message || "API 연동안됨 로그인하지 못했습니다.";
    throw new Error(errorMessage);
  }
};
