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
      `${API_ENDPOINTS.LEVEL_TEST.GET_QUESTIONS}/${categoryId}`,
      {
        headers: {
          memberId: memberId,
        },
      }
    );

    if (response.data.status === "OK") {
      console.log("레벨 테스트 문제 서버 응답 성공");
    } else {
      throw new Error(
        response.data.message || "레벨 테스트 문제 비즈니스 로직 에러"
      );
    }

    // 문제 저장
    const session: LevelTestSession = {
      questions: response.data.data,
      answers: [],
      categoryId,
      memberId,
    };

    sessionStorage.setItem("levelTest", JSON.stringify(session));
    return true;
  } catch (error: unknown) {
    console.log("레벨테스트 문제 API 호출 실패", error);
  }
};

// 세션 데이터 가져오기
export const getSession = (): LevelTestSession | null => {
  try {
    const data = sessionStorage.getItem("levelTest");
    return data ? JSON.parse(data) : null;
  } catch (error: unknown) {
    console.log("세션데이터를 가져오지 못했습니다.", error);
    return null;
  }
};

// getQusetion() 문제가져오기
export const getQuestion = (questionNumber: number): ApiQuestion | null => {
  const session = getSession();
  if (!session) return null;

  const index = questionNumber - 1;
  return session.questions[index] || null;
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

// 제출용 데이터
export const getSubmitData = () => {
  const session = getSession();
  if (!session) return null;

  return {
    answers: session.answers,
    memberId: session.memberId,
  };
};

export const levelTestSubmit = async (): Promise<boolean> => {
  const submitData = getSubmitData();

  if (!submitData) {
    console.log("제출할 데이터가 없어요");
    return false;
  }

  try {
    const response = await apiClient.post(
      API_ENDPOINTS.LEVEL_TEST.SUBMIT_ANSWERS,
      { answers: submitData.answers },
      {
        headers: {
          memberId: submitData.memberId,
        },
      }
    );

    if (response.data.status === "OK") {
      console.log("answer 제출 완료");
      clearSession(); // 제출성공하면 세션 삭제
      return true;
    } else {
      throw new Error(
        response.data.message || "answer 제출 비즈니스 로직 에러"
      );
    }
  } catch (error: unknown) {
    console.log("answer 제출 실패", error);
    return false;
  }
};

//세션 삭제
export const clearSession = (): void => {
  sessionStorage.removeItem("levelTest");
};
