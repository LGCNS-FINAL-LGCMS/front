import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";


export interface ResponseData {
  answer: string;
  imageUrl: string;
}

export interface GuideApiResponse {
  status: string;
  message: string;
  data: ResponseData;
}

export const postGuides = async (
    query: string
): Promise<ResponseData> => {
  try {
    const response = await apiClient.post<GuideApiResponse>(
      API_ENDPOINTS.GUIDE.POST,
        { query },
    );
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "채팅을 처리하는 중 오류가 발생했습니다.";
    console.error("Guide API error:", message);
    throw new Error(message);
  }
};
