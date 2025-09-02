//reviewAPI.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

export interface ReviewContentRequest {
  question: string;
  answer: number;
}

export interface ReviewRequest {
  comment: string;
  star: number;
  nickname: string;
  suggestion?: string;
  reviewContentRequests: ReviewContentRequest[];
}

export const getReviewRequest = async (lectureId: string | number) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LECTURE.REVIEW.GET}/${lectureId}`
    );

    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "리뷰 불러오기 실패");
    console.error("GET Review API error:", message);
    throw new Error(message);
  }
};

// 리뷰 POST
export const postReviewRequest = async (
  lectureId: string | number,
  reviewData: ReviewRequest
) => {
  try {
    const response = await apiClient.post(
      `${API_ENDPOINTS.LECTURE.REVIEW.POST}/${lectureId}`,
      reviewData
    );
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "리뷰 등록 실패");
    console.error("POST Review API error:", message);
    throw new Error(message);
  }
};
