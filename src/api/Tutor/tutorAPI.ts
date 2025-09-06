// tutorAPI.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

export const tutorRequest = async (lectureId: string, question: string) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.TUTOR.POST}`, {
      lectureId: lectureId,
      question: question,
    });
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "튜터 질문 실패");
    console.error("POST Tutor API error:", message);
    throw new Error(message);
  }
};
