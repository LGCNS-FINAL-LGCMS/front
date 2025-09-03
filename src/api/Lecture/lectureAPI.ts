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

interface LectureFiles {
  id: string;
  files: File[];
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

export const lectureFilesUpload = async (lectureFiles: LectureFiles) => {
  try {
    const formData = new FormData();
    formData.append("id", String(lectureFiles.id));

    lectureFiles.files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post(
      API_ENDPOINTS.LECTURE.POST_FILES,
      formData
    );
    console.log(response);
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "강의 파일 업로드 실패");
    console.error("Post Lecture Files API error:", message);
    throw new Error(message);
  }
};

export const postLectureStudent = async ( lectureId:string)=>{
  try {
    const response = await apiClient.post(
      `${API_ENDPOINTS.STUDENT.POST_LECTURE_STUDENT}/${lectureId}`
    );
    console.log("Lecture Join Response:", response);
    return response.data.data;
  }catch(error: unknown){
    const message = getErrorMessage(error, "강의 수강 실패");
    console.error("Lecture Join API error:", message);
    throw new Error(message);
  }
};