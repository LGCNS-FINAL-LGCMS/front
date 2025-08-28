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
import nextButton from "../../assets/images/levelTestPage/nextButton.svg";
import preButton from "../../assets/images/levelTestPage/preButton.svg";

const LevelTestContainer = styled.div`
  font-family: ${(props) => props.theme.font.primary};

  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimerSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  padding: 20px 30px;
  border-radius: 16px;
`;

const TimeBox = styled.div`
  background: ${(props) => props.theme.colors.border_Light};
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  min-width: 80px;
  color: white;

  box-shadow: ${(props) => props.theme.shadow.md};
`;

const TimeNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.border_Dark};
`;

const TimeLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const TestContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: ${(props) => props.theme.shadow.md};
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
`;

const QuestionHeader = styled.div`
  background: ${(props) => props.theme.colors.border_Light};
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`;

const QuestionContainer = styled.div`
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-size: 18px;
  line-height: 1.6;
  color: #333;
  border: 2px solid #e9ecef;
  min-height: 120px;
  display: flex;
  align-items: center;
`;

const AnswerContainer = styled.div`
  margin-bottom: 40px;
`;

const Answer = styled.input`
  width: 100%;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
`;
const PreButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: auto;
  height: auto;
  border-radius: 4px;
  transition: all 0.3s ease;

  // 아이콘에만 호버 효과 적용
  img {
    transition: all 0.3s ease;
    border-radius: 4px;
  }

  &:hover:not(:disabled) img {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: auto;
  height: auto;
  border-radius: 4px;
  transition: all 0.3s ease;

  // 아이콘에만 호버 효과 적용
  img {
    transition: all 0.3s ease;
    border-radius: 4px;
  }

  &:hover:not(:disabled) img {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressSection = styled.div`
  margin: 20px 0;
  padding: 0 20px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
`;

const LevelTestPage = () => {
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState<ApiQuestion[]>([]); // 모든 문제
  const [currentQuestion, setCurrentQuestion] = useState<ApiQuestion | null>(
    null
  ); //현재 문제
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 문제 순서를 세션에서 인덱스로 관리
  const [answerInput, setAnswerInput] = useState<string>(""); // 사용자가 적은 답변

  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 띄우기

  const [seconds, setSeconds] = useState(30 * 60); // 30분

  const getTimeDisplay = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  // 1초마다 1초씩 빼기(타이머)
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowSuccessModal(true);
    }
  }, [seconds]);

  //세션에서 문제 불러오기
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
  // 버튼 눌렀을 때 문제 렌더링
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

  // 답변 제출
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

  // 다음 문제 버튼
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

  // 이전 문제 버튼
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentAnswer();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 모달창 확인 누르면 대시보드 페이지로
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

  // 모달창 취소버튼
  const handleCancel = () => {
    setShowSuccessModal(false);
  };

  // progress
  const progress =
    allQuestions.length > 0
      ? ((currentQuestionIndex + 1) / allQuestions.length) * 100
      : 0;

  const timeDisplay = getTimeDisplay();

  return (
    <LevelTestContainer>
      <TimerSection>
        <TimeBox>
          <TimeNumber>{timeDisplay.hours}</TimeNumber>
          <TimeLabel>Hours</TimeLabel>
        </TimeBox>
        <TimeBox>
          <TimeNumber>{timeDisplay.minutes}</TimeNumber>
          <TimeLabel>Minutes</TimeLabel>
        </TimeBox>
        <TimeBox>
          <TimeNumber>{timeDisplay.seconds}</TimeNumber>
          <TimeLabel>Seconds</TimeLabel>
        </TimeBox>
      </TimerSection>

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

        <ButtonContainer>
          <PreButton
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <img src={preButton} />
          </PreButton>
          <NextButton onClick={handleNext}>
            <img src={nextButton} alt="다음" />
          </NextButton>
        </ButtonContainer>
      </TestContainer>

      <ProgressSection>
        <ProgressBarContainer>
          <ProgressBarFill progress={progress} />
        </ProgressBarContainer>
        <ProgressText>
          {currentQuestionIndex + 1} / {allQuestions.length} 문제
        </ProgressText>
      </ProgressSection>

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
