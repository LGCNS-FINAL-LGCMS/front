import { API_ENDPOINTS } from "../../constants/endpoints";
import apiClient from "../index";

export interface ResponseFormat<T> {
  status: string;
  message: string;
  data: T;
}

export interface CategoryFormat {
  id: number;
  name: string;
}

interface CheckNicknameDuplicateResponse {
  isUsed: boolean;
}
// nickname API
export const checkNicknameDuplicate = async (
  nickname: string
): Promise<ResponseFormat<CheckNicknameDuplicateResponse>> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHECK_NICKNAME, {
      nickname,
    });

    return response.data;
  } catch (error) {
    console.log("닉네임 서버 호출 실패", error);
    throw new Error("닉네임 중복 체크 실패");
  }
};

//회원가입 api (회원정보수정)
interface SignupResponse {
  nickname: string;
  categories: CategoryFormat[];
  getDesireLecturer: boolean;
}

export const signupAPI = async (
  nickname: string,
  categories: CategoryFormat[],
  getDesireLecturer: boolean | null
): Promise<ResponseFormat<SignupResponse>> => {
  try {
    const response = await apiClient.patch(API_ENDPOINTS.USER.UPDATE, {
      nickname: nickname.trim(),
      categories,
      desireLecturer: getDesireLecturer,
    });

    return response.data;
  } catch (error) {
    console.log("회원정보 서버 호출 실패", error);
    throw new Error("회원 서버 호출 실패");
  }
};

//category API (전체조회)
export const categoriesList = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USER.CATEGORY_LIST);
    return response.data;
  } catch (error) {
    console.log("카테고리 서버 호출 실패", error);
    throw new Error("카테고리 조회 실패");
  }
};
