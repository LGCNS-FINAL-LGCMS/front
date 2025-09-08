import apiClient from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";

export interface ApiQuestion {
  id: number;
  category: string;
  difficulty: "LOW" | "MEDIUM" | "HIGH";
  question: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: ApiQuestion[];
}

export interface Answer {
  questionId: number;
  answer: string;
}

export interface LevelTestSession {
  questions: ApiQuestion[];
  answers: Answer[];
  categoryId: number;
  memberId: number;
}

export const levelTestApi = async (categoryId: number, memberId: number) => {
  try {
    const response = await apiClient.get<ApiResponse>(
      `${API_ENDPOINTS.LEVEL_TEST.GET_QUESTIONS}?categoryId=${categoryId}`
    );

    // 문제 저장
    const session: LevelTestSession = {
      questions: response.data.data,
      answers: [],
      categoryId,
      memberId,
    };

    sessionStorage.setItem("levelTest", JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
};

// 세션 데이터 가져오기
export const getSession = (): LevelTestSession | null => {
  try {
    const data = sessionStorage.getItem("levelTest");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 답변 저장하기
export const saveAnswer = (questionId: number, answer: string): void => {
  const session = getSession();
  if (!session) return;

  // 기존에 답변한 데이터가 있는지 확인
  const savedAnswerIndex = session.answers.findIndex(
    (a) => a.questionId === questionId
  );

  if (savedAnswerIndex !== -1) {
    session.answers[savedAnswerIndex].answer = answer; // 기존 답변이 있다면 answer 업데이트
  } else {
    session.answers.push({ questionId, answer });
  }

  sessionStorage.setItem("levelTest", JSON.stringify(session));
};

// session에 저장된 답변 가져오기
export const getAnswer = (questionId: number): string => {
  const session = getSession();

  if (!session) return "";

  const answer = session.answers.find((a) => a.questionId === questionId);
  return answer?.answer || "";
};

//세션 삭제
export const clearSession = (): void => {
  sessionStorage.removeItem("levelTest");
};
