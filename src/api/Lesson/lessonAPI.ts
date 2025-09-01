// lessonApi.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

export interface LessonMetadataPayload {
  title: string;
  information: string;
}

// 강좌 메타데이터 추가 요청
export const postLessonMetadata = async (
  lectureId: string,
  payload: LessonMetadataPayload
) => {
  try {
    const response = await apiClient.post(
      `${API_ENDPOINTS.LESSON.POST_META}/${lectureId}`,
      payload
    );
    console.log("Post Lesson Metadata Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "레슨 메타데이터 등록 실패");
    console.error("Post Lesson Metadata API error:", message);
    throw new Error(message);
  }
};

export const postLessonFiles = async (
  lessonId: string,
  lectureId: string,
  file: File
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", lessonId);
    formData.append("lectureId", lectureId);

    const response = await apiClient.post(
      `${API_ENDPOINTS.LESSON.POST_FILES}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Post Lesson Files Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "레슨 파일 등록 실패");
    console.error("Post Lesson Files API error:", message);
    throw new Error(message);
  }
};

// 강좌 메타데이터 수정
export const modifyLessonMetadata = async (
  lessonId: string,
  information: string
) => {
  try {
    const response = await apiClient.put(
      `${API_ENDPOINTS.LESSON.MODIFY}/${lessonId}`,
      information
    );
    console.log("Modify Lesson Metadata Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "레슨 메타데이터 수정 실패");
    console.error("Modify Lesson Metadata API error:", message);
    throw new Error(message);
  }
};

// 강좌 삭제 요청
export const deleteLesson = async (lessonId: string) => {
  try {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.LESSON.DELETE}/${lessonId}`
    );
    console.log("Delete Lesson Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "레슨 삭제 실패");
    console.error("Delete Lesson API error:", message);
    throw new Error(message);
  }
};

// 강좌 상세 메타정보 리스트 조회
export const getLessonDetails = async (lectureId: string) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LESSON.GET.DETAIL}/${lectureId}`
    );
    console.log("Get Detail Lesson Data Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "레슨 상세 정보 가져오기 실패");
    console.error("Get Detail Lesson Datas API error:", message);
    throw new Error(message);
  }
};

// 강좌 타이틀 및 플레이타임 리스트 조회
export const getLessonTitles = async (lectureId: string) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LESSON.GET.TITLE}/${lectureId}`
    );
    console.log("Get Lesson Title Data Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "레슨 타이틀 정보 가져오기 실패");
    console.error("Get Lesson Title Datas API error:", message);
    throw new Error(message);
  }
};

// 단일 강좌 메타정보 조회
export const getLessonSectionData = async (lectureId: string) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.LESSON.GET.SECTION}/${lectureId}`
    );
    console.log("Get Lesson Section Data Response:", response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "레슨 단일 정보 가져오기 실패");
    console.error("Get Lesson Section Datas API error:", message);
    throw new Error(message);
  }
};
