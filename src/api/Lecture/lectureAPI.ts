// categoryApi.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

interface LecturePayload {
  title: string;
  category: string;
  information: string;
  level: string;
  price: number;
  description: string;
  nickname: string;
}

export const openLectureRequest = async (lectureData: LecturePayload) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.LECTURE.OPEN,
      lectureData
    );
    console.log("Lecture Open Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "강의 등록 실패");
    console.error("Open Lecture API error:", message);
    throw new Error(message);
  }
};
