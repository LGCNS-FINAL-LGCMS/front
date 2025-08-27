import { useEffect, useState } from "react";
import styled from "styled-components";
import type { ApiQuestion } from "../../utils/sessionStorage/levelTest";
import {
  clearSession,
  getAnswer,
  getSession,
  saveAnswer,
} from "../../utils/sessionStorage/levelTest";
import InfoCheckModal from "../../components/Signup/signupModal";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { API_ENDPOINTS } from "../../constants/endpoints";
import apiClient from "../../api";

const LevelTestContainer = styled.div``;

const TimerSection = styled.div``;

const QuestionHeader = styled.div``;

const TestContainer = styled.div``;

const QuestionSection = styled.div``;

const AnswerContainer = styled.div``;
const Answer = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const QuestionContainer = styled.div``;

const PreButton = styled.button``;

const NextButton = styled.button``;

const ProgressSection = styled.div``;

const LevelTestPage = () => {
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState<ApiQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ApiQuestion | null>(
    null
  ); //현재 문제
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 문제 순서를 세션에서 인덱스로 관리

  const [answerInput, setAnswerInput] = useState<string>(""); // 사용자가 적은 답변

  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달

  useEffect(() => {
    const session = getSession();
    if (!session || !session.questions || session.questions.length !== 10) {
      alert("레벨 테스트 데이터를 불러올 수 없습니다. 처음부터 시작해주세요.");
      navigate(PAGE_PATHS.LEVEL_TEST.DASHBOARD);
      return;
    } else {
      setAllQuestions(session.questions);
    }
  }, [navigate]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerInput(e.target.value);
  };

  useEffect(() => {
    if (allQuestions.length > 0 && currentQuestionIndex < allQuestions.length) {
      const newQuestion = allQuestions[currentQuestionIndex];
      setCurrentQuestion(newQuestion);

      const savedAnswer = getAnswer(newQuestion.id);
      setAnswerInput(savedAnswer);
    }
  }, [currentQuestionIndex, allQuestions]);

  // 답변 저장 함수
  const saveCurrentAnswer = () => {
    if (currentQuestion) {
      saveAnswer(currentQuestion.id, answerInput.trim());
    }
  };

  const levelTestSubmit = async (): Promise<boolean> => {
    const submitData = getSession();

    if (!submitData) {
      console.log("제출할 데이터가 없어요");
      return false;
    } else {
      try {
        const response = await apiClient.post(
          API_ENDPOINTS.LEVEL_TEST.SUBMIT_ANSWERS,
          { answers: submitData.answers }
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
    }
  };

  // 다음 문제
  const handleNext = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (answerInput.trim()) {
        setShowSuccessModal(true);
      } else {
        alert("문제의 답변을 입력해주세요.");
      }
    }
  };

  // 이전 문제
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentAnswer();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 확인 누르면 대시보드 페이지로
  const handleConfirm = async () => {
    try {
      const success = await levelTestSubmit();

      if (success) {
        navigate(PAGE_PATHS.LEVEL_TEST.DASHBOARD);
      } else {
        alert("제출에 실패했습니다. 다시 시도해주세요.");
        setShowSuccessModal(false);
      }
    } catch (error) {
      console.error("제출 중 에러:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      setShowSuccessModal(false);
    }
  };

  const handleCancel = () => {
    setShowSuccessModal(false);
  };

  return (
    <LevelTestContainer>
      <TimerSection></TimerSection>
      <TestContainer>
        <QuestionHeader></QuestionHeader>
        <QuestionContainer>{currentQuestion?.question}</QuestionContainer>
        <AnswerContainer>
          <Answer
            type="text"
            value={answerInput}
            onChange={handleAnswerChange}
            placeholder="답변을 입력하세요"
          />
        </AnswerContainer>
        <PreButton
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          이전
        </PreButton>
        <NextButton onClick={handleNext}>다음</NextButton>
      </TestContainer>
      <QuestionSection></QuestionSection>
      <ProgressSection></ProgressSection>

      <InfoCheckModal
        isOpen={showSuccessModal}
        message="답변을 제출하면 레포트 작성이 시작됩니다. 제출하시겠습니까?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="확인"
        cancelText="취소"
      />
    </LevelTestContainer>
  );
};

export default LevelTestPage;
