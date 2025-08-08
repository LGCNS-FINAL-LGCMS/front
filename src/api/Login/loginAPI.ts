// 로그인
// 1. 구글 토큰 백으로
// 2. 비회원 시) 회원가입 페이지
//    회원 시) 백에서 토큰이랑 회원정보 받아서 로컬 스토리리에 저장(세션 스토리지?)

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";

export interface GoogleLoginRequest {
  idTokenString: string; // 구글에서 받은 JWT 토큰
}

export interface GoogleLoginResponse {
  status: string;
  message: string;
  data: {
    alreadyMember: boolean;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export const googleLoginAPI = async (
  idTokenString: string
): Promise<GoogleLoginResponse> => {
  try {
    const response = await apiClient.post<GoogleLoginResponse>(
      API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
      { idTokenString }
    );
    console.log("구글 로그인 API 응답 성공!", response?.data);
    return response.data;
  } catch (error: any) {
    console.log("구글 로그인 API 응답 실패", error);
    const errorMessage =
      error.response?.data?.message || "구글에서 로그인하지 못했습니다.";
    throw new Error(errorMessage);
  }
};
