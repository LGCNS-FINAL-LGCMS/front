// qnaAPI.ts

import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";
import type { Qna } from "../../types/qna";

interface PostQnaPayload {
  title: string;
  content: string;
  lectureId: string;
}

interface PatchQnaPayload {
  questionId: string;
  title?: string;
  content?: string;
}

interface PostAnswerPayload {
  questionId: string | undefined;
  lectureId: string;
  content: string;
}

interface PutAnswerPayload {
  answerId: string;
  lectureId: string;
  content: string;
}

export const getLectureQnas = async (lectureId: string): Promise<Qna[]> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.QNA.GET}/${lectureId}`
    );
    return response.data.data.content;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "현재 강의 Q&A 불러오기 실패");
    console.error("Get Q&As API error:", message);
    throw new Error(message);
  }
};

export const getQnaById = async (qnaId: string | undefined) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.QNA.GET_DETAIL}/${qnaId}`
    );
    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "id 기반 Q&A 불러오기 실패");
    console.error("Get Q&A by Id API error:", message);
    throw new Error(message);
  }
};

export const postQna = async ({
  title,
  content,
  lectureId,
}: PostQnaPayload) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.QNA.POST, {
      title,
      content,
      lectureId,
    });
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "질문 등록하기 실패");
    console.error("Post Q&A API error:", message);
    throw new Error(message);
  }
};

export const deleteQna = async (questionId: string) => {
  try {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.QNA.DELETE}/${questionId}`
    );
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "질문 삭제하기 실패");
    console.error("Delete Q&A API error:", message);
    throw new Error(message);
  }
};

export const patchQna = async ({
  questionId,
  title,
  content,
}: PatchQnaPayload) => {
  try {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.QNA.PATCH}/${questionId}`,
      {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      }
    );
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "질문 수정하기 실패");
    console.error("Patch Q&A API error:", message);
    throw new Error(message);
  }
};

export const getMemberQnas = async (): Promise<Qna[]> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.QNA.MEMBER.GET}`);
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "유저 Q&A 불러오기 실패");
    console.error("Get User Q&As API error:", message);
    throw new Error(message);
  }
};

export const postAnswer = async ({
  questionId,
  lectureId,
  content,
}: PostAnswerPayload) => {
  try {
    const response = await apiClient.post(
      `${API_ENDPOINTS.QNA.MEMBER.LECTURE.POST}/${questionId}`,
      {
        lectureId,
        content,
      }
    );
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "강사 답변 등록 실패");
    console.error("Post Answer API error:", message);
    throw new Error(message);
  }
};

export const putAnswer = async ({
  answerId,
  lectureId,
  content,
}: PutAnswerPayload) => {
  try {
    const response = await apiClient.put(
      `${API_ENDPOINTS.QNA.MEMBER.LECTURE.PUT}/${answerId}`,
      {
        lectureId,
        content,
      }
    );
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "강사 답변 수정 실패");
    console.error("Put Answer API error:", message);
    throw new Error(message);
  }
};
