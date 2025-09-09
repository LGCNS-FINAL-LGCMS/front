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

export const postGuides = async (query: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.post<GuideApiResponse>(
      API_ENDPOINTS.GUIDE.POST,
      { query }
    );
    return response.data.data;
  } catch (error: unknown) {
    let message = "채팅을 처리하는 중 오류가 발생했습니다.";

    if (error instanceof Error) {
      message = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { message?: unknown } } }).response
        ?.data?.message === "string"
    ) {
      message = (error as { response: { data: { message: string } } }).response
        .data.message;
    }

    // console.error("Guide API error:", message);
    throw new Error(message);
  }
};