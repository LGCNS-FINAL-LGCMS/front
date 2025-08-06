import { API_ENDPOINTS } from "../../constants/endpoints";
import apiClient from "../index";

interface ResponseFormat<T> {
  status: string;
  message: string;
  data: T;
}

export interface CategoryFormat {
  id: number;
  name: string;
}

// nickname API
interface CheckNicknameDuplicateResponse {
  isUsed: boolean;
}

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<ResponseFormat<CheckNicknameDuplicateResponse>> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHECK_NICKNAME, {
      nickname,
    });

    return response.data;
  } catch (error) {
    console.log("호출 실패 -> 더미데이터", error);
    throw new Error("닉네임 중복 체크 실패");
  }
};

//회원가입 api (회원정보수정)
interface SignupResponse {
  nickname: string;
  categories: CategoryFormat[];
  wantTeacher: boolean;
}

export const signupAPI = async (
  nickname: string,
  categories: CategoryFormat[],
  wantTeacher: boolean | null
): Promise<ResponseFormat<SignupResponse>> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.USER.INFO, {
      nickname: nickname.trim(),
      categories: categories,
      wantTeacher: wantTeacher,
    });

    return response.data;
  } catch (error) {
    console.log("호출 실패 -> 더미데이터", error);
    // 더미 데이터
    return {
      status: "OK",
      message: "",
      data: {
        nickname: nickname,
        categories: [
          {
            id: 1,
            name: "스프링",
          },
          {
            id: 2,
            name: "리액트",
          },
          {
            id: 3,
            name: "자바스크립트",
          },
        ],
        wantTeacher: true,
      },
    };
  }
};

//category API (전체조회)
export const categoriesList = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USER.CATEGORY);
    console.log("받아온 데이터 :", response);
    return response;
  } catch (error) {
    console.log("서버 에러임", error);
    return {
      status: "OK",
      message: "호출에 성공했습니다",
      data: {
        categories: [
          {
            id: 1,
            name: "스프링",
          },
          {
            id: 2,
            name: "리액트",
          },
          {
            id: 3,
            name: "자바스크립트",
          },
        ],
      },
    };
  }
};
