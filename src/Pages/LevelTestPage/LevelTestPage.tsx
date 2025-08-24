import { useEffect, useState } from "react";
import styled from "styled-components";
import type { ApiQuestion } from "../../utils/sessionStorage/levelTest";
import { getSession } from "../../utils/sessionStorage/levelTest";

const LevelTestContainer = styled.div``;

const TimerSection = styled.div``;

const TestSection = styled.div``;

const QuestionSection = styled.div``;

const ProgressSection = styled.div``;

const Question = styled.div``;

const LevelTestPage = () => {
  const [currentQuestions, setCurrentQuestions] = useState<ApiQuestion | null>(
    null
  ); //현재 문제
  const [answerInput, setAnswerInput] = useState<string>(""); // 사용자가 적은 답변

  useEffect(() => {
    const session = getSession();
    if (session) {
      setCurrentQuestions(session.questions[0]); // 1번 문제 ~
      return;
    }
  }, []);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerInput(e.target.value);
  };
  return (
    <LevelTestContainer>
      <TimerSection></TimerSection>
      <TestSection>
        <Question>{currentQuestions?.question}</Question>
        <input
          type="text"
          value={answerInput}
          onChange={handleAnswerChange}
          placeholder="답변을 입력하세요"
        />
      </TestSection>
      <QuestionSection></QuestionSection>
      <ProgressSection></ProgressSection>
    </LevelTestContainer>
  );
};

export default LevelTestPage;
