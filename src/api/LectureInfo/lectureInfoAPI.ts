// api/Lecture/lectureAPI.ts

import apiClient from "..";
import type { Lecture } from "../../types/lecture";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

export const getLectureById = async (lectureId: string): Promise<Lecture> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LECTURE.GET}/${lectureId}`
    );
    return response.data.data;
  } catch (error) {
    const message = getErrorMessage(
      error,
      "강의 id 기반 강의 데이터 불러오기 실패"
    );
    console.error("getLectureById API error:", message);
    throw new Error(message);
  }
};

export const checkLecturePurchased = async (lecture: {
  lectureId: string;
  title: string;
  price: number;
}) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.USER.CHECK_LECTURE_PURCHASED}`,
      {
        params: {
          lectureId: lecture.lectureId,
          title: lecture.title,
          price: lecture.price,
        },
      }
    );
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error, "강의 수강여부 확인 실패");
    console.error("checkLectureEnrollment API error:", message);
    throw new Error(message);
  }
};
