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
import pagenationButton from "../../assets/images/levelTestPage/pagenationButton.svg";
import Button from "../../components/Common/Button";

const LevelTestContainer = styled.div`
  font-family: ${(props) => props.theme.font.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => props.theme.size.containerMax};
  height: calc(100vh - ${(props) => props.theme.size.header.height} - 80px);
  padding: 10px 20px;
`;

const TimerSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 20px;
  border-radius: 16px;
  margin-bottom: 20px;
`;

const TimeBox = styled.div<{ isWarning: number }>`
  background: ${(props) => {
    const { isWarning } = props;

    if (isWarning <= 60) {
      const progress = (60 - isWarning) / 50; // 10초일 때부터 빨간색
      return `rgba(220, 53, 69, ${progress})`;
    } else {
      return props.theme.colors.border_Light;
    }
  }};

  padding: 15px;
  border-radius: 12px;
  text-align: center;
  min-width: 100px;
  box-shadow: ${(props) => props.theme.shadow.md};
  transition: ${(props) => props.theme.transition.default};
  ${(props) =>
    props.isWarning <= 60 &&
    `animation: pulse 1s infinite;
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `}
`;

const TimeNumber = styled.div`
  font-size: ${(props) => props.theme.fontSize.title.min};
  font-weight: bold;
  color: ${(props) => props.theme.colors.border_Dark};
`;

const TimeLabel = styled.div`
  font-size: ${(props) => props.theme.fontSize.small.min};
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
  height: 100%;
`;

// 문제 헤더
const QuestionHeader = styled.div`
  background: ${(props) => props.theme.colors.background_Overlay};
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSize.contents.medium};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuestionInfo = styled.div`
  display: flex;
  align-items: center;
`;

const QuestionNumber = styled.span`
  font-size: ${(props) => props.theme.fontSize.contents.medium};
  font-weight: bold;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const DifficultyTag = styled.span`
  background: ${(props) => props.theme.colors.gray_D};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: ${(props) => props.theme.fontSize.small.min};
  font-weight: normal;
`;

const CategoryTag = styled.span`
  background: ${(props) => props.theme.colors.gray_D};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: ${(props) => props.theme.fontSize.small.min};
  font-weight: normal;
`;

//문제
const QuestionContainer = styled.div`
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-size: ${(props) => props.theme.fontSize.contents.medium};
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text_D};
  border: ${(props) => props.theme.colors.border_Dark};
  min-height: 120px;
  height: 20%;
  display: flex;
  align-items: center;
`;

//답변
const AnswerContainer = styled.div`
  margin-bottom: 40px;
`;

const Answer = styled.textarea`
  width: 100%;
  padding: 20px;
  border: ${(props) => props.theme.colors.border_Dark};
  border-radius: 12px;
  font-size: ${(props) => props.theme.fontSize.button.max};
  transition: ${(props) => props.theme.transition.slow};
  background: #f8f9fa;

  min-height: 100px;
  resize: none;
  overflow-y: auto;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.border_Dark};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.border_Dark};
  }
`;

//버튼
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: 10%;
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
  transition: ${(props) => props.theme.transition.default};

  img {
    transition: ${(props) => props.theme.transition.default};
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
  transition: ${(props) => props.theme.transition.default};

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

//페이지 네이션
const QuestionNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuestionNavButton = styled.button<{
  isActive: boolean;
  hasAnswer: boolean;
}>`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  margin: 0 5px;
  position: relative;
  transition: ${(props) => props.theme.transition.default};

  img {
    width: 35px;
    height: 35px;
    transition: ${(props) => props.theme.transition.default};

    // 아이콘 색상 변경 필터
    filter: ${(props) => {
      if (props.isActive) {
        return "brightness(1.8) ";
      }
      if (props.hasAnswer) {
        return "brightness(0.5) ";
      }
      return "brightness(2.8) ";
    }};
  }

  &:hover {
    transform: scale(1.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NumberOverlay = styled.span<{ hasAnswer: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSize.button.min};
  pointer-events: none;

  color: ${(props) =>
    props.hasAnswer ? "white" : props.theme.colors.background_D};
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  & > * {
    display: block;
  }
`;

const LevelTestPage = () => {
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState<ApiQuestion[]>([]); // 모든 문제
  const [currentQuestion, setCurrentQuestion] = useState<ApiQuestion | null>(
    null
  ); //현재 문제
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 문제 순서를 세션에서 인덱스로 관리
  const [answerInput, setAnswerInput] = useState<string | null>(null); // 사용자가 적은 답변

  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 띄우기
  const [showAnswerCheckModal, setShowAnswerCheckModal] = useState(false); // 답변 없을 때 알림 모달
  const [showTimeoverModal, setShowTimeoverModal] = useState(false); // 타임오버 됐을 때 모달

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

  //난이도
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "LOW":
        return "난이도 : ⭐️";
      case "MEDIUM":
        return "난이도 : ⭐️⭐️";
      case "HIGH":
        return "난이도 : ⭐️⭐️⭐️";
    }
  };

  // 1초마다 1초씩 빼기(타이머)
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowTimeoverModal(true);
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
      session.questions.forEach((question) => {
        const backendQuestionId = question.id;
        saveAnswer(backendQuestionId, "");
      });
    }
  }, [navigate]);

  //input 입력시 세션에 데이터 바로 저장
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerInput(e.target.value);
    saveCurrentAnswer();
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
      const answerToSave = answerInput ? answerInput.trim() : "";
      saveAnswer(currentQuestion.id, answerToSave);
    }
  };

  //페이지네이션_저장된 답변확인-> 채워진 아이콘(boolean)
  const hasAnswerForQuestion = (questionId: number): boolean => {
    const savedAnswer = getAnswer(questionId);
    return savedAnswer ? savedAnswer.trim().length > 0 : false;
  };

  //페이지네이션_아이콘 클릭 시 이동
  const navigateToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  // 답변 제출
  const levelTestSubmit = async (): Promise<boolean> => {
    const submitData = getSession();

    if (!submitData?.answers) {
      console.log("제출할 데이터가 없어요");
      console.log(submitData);
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
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 이전 문제 버튼
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 시험 제출 버튼
  const handleTestSuccess = () => {
    const checkAllAnswersCompleted = (): boolean => {
      const session = getSession();
      if (!session?.answers || !session?.questions) return false;

      return session.questions.every((question) => {
        const answer = session.answers.find(
          (a) => a.questionId === question.id
        );
        return answer && answer.answer && answer.answer.trim().length > 0;
      });
    };

    const allCompleted = checkAllAnswersCompleted();

    if (allCompleted) {
      setShowSuccessModal(true);
    } else {
      setShowAnswerCheckModal(true);
    }
  };

  // 모달 확인 버튼(답변 제출)
  const handleSubmit = async () => {
    try {
      const success = await levelTestSubmit();
      if (success) {
        setShowSuccessModal(false);
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

  //모달 취소 버튼
  const handleCancel = () => {
    setShowAnswerCheckModal(false);
    setShowSuccessModal(false);
  };

  const timeDisplay = getTimeDisplay();

  return (
    <LevelTestContainer>
      <TimerSection>
        <TimeBox isWarning={seconds}>
          <TimeNumber>{timeDisplay.hours}</TimeNumber>
          <TimeLabel>Hours</TimeLabel>
        </TimeBox>
        <TimeBox isWarning={seconds}>
          <TimeNumber>{timeDisplay.minutes}</TimeNumber>
          <TimeLabel>Minutes</TimeLabel>
        </TimeBox>
        <TimeBox isWarning={seconds}>
          <TimeNumber>{timeDisplay.seconds}</TimeNumber>
          <TimeLabel>Seconds</TimeLabel>
        </TimeBox>
      </TimerSection>

      <TestContainer>
        <QuestionHeader>
          <QuestionInfo>
            <QuestionNumber>Question {currentQuestionIndex + 1}</QuestionNumber>
          </QuestionInfo>
          <QuestionMeta>
            <DifficultyTag>
              {getDifficultyIcon(currentQuestion?.difficulty) || "Normal"}
            </DifficultyTag>
            <CategoryTag>{currentQuestion?.category || "General"}</CategoryTag>
          </QuestionMeta>
        </QuestionHeader>
        <QuestionContainer>{currentQuestion?.question}</QuestionContainer>
        <AnswerContainer>
          <Answer
            value={answerInput || ""}
            onChange={handleAnswerChange}
            placeholder="답변을 입력하세요"
            rows={4}
          />
        </AnswerContainer>

        <ButtonContainer>
          <PreButton
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <img src={preButton} />
          </PreButton>

          <QuestionNavigation>
            {allQuestions.map((question, index) => {
              const isActive = index === currentQuestionIndex;
              const hasAnswer = hasAnswerForQuestion(question.id);

              return (
                <QuestionNavButton
                  key={question.id}
                  isActive={isActive}
                  hasAnswer={hasAnswer}
                  onClick={() => navigateToQuestion(index)}
                >
                  <img src={pagenationButton} alt={`문제 ${index + 1}`} />
                  <NumberOverlay hasAnswer={hasAnswer}>
                    {index + 1}
                  </NumberOverlay>{" "}
                </QuestionNavButton>
              );
            })}
          </QuestionNavigation>

          <NextButton
            onClick={handleNext}
            disabled={currentQuestionIndex === 9}
          >
            <img src={nextButton} alt="다음" />
          </NextButton>
        </ButtonContainer>
      </TestContainer>

      <SubmitContainer>
        <SubmitButton type="button">
          <Button text="시험 제출" onClick={handleTestSuccess} design={2} />
        </SubmitButton>
      </SubmitContainer>

      <InfoCheckModal
        isOpen={showSuccessModal}
        message="답변이 제출되어 레포트 작성을 시작합니다."
        onConfirm={handleSubmit}
        onCancel={handleCancel}
        confirmText="확인"
      />

      <InfoCheckModal
        isOpen={showAnswerCheckModal}
        message="답변을 작성하지 않은 문제가 있습니다. 그래도 제출하시겠습니까?"
        onConfirm={handleSubmit}
        onCancel={handleCancel}
        confirmText="제출"
        cancelText="취소"
      />

      <InfoCheckModal
        isOpen={showTimeoverModal}
        message="시험시간이 종료되어 작성하신 답변이 제출되었습니다. 레포트를 확인하세요."
        onConfirm={handleSubmit}
        onCancel={handleCancel}
        confirmText="확인"
      />
    </LevelTestContainer>
  );
};

export default LevelTestPage;
