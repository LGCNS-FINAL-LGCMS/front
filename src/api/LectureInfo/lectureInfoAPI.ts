// api/Lecture/lectureAPI.ts

import apiClient from "..";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

export interface LessonResponse {
  id: string;
  title: string;
  lectureId: string | null;
  playtime: number;
  information: string | null;
  thumbnail: string | null;
  videoUrl: string | null;
  createdAt?: [number, number, number, number, number, number, number]; // [year, month, day, hour, min, sec, nano]
  progress?: number | null;
}

export interface LectureResponse {
  lectureId: string;
  title: string;
  description: string;
  information: string;
  nickname: string;
  price: number;
  textbook: string;
  thumbnail: string;
  averageStar: number;
  reviewCount: number | null;
}

export interface LectureData {
  isStudent: boolean;
  lectureResponseDto: LectureResponse;
  lessonResponses: LessonResponse[];
  progress: number | null;
}

export const getLectureById = async (
  lectureId: string
): Promise<LectureData> => {
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
