import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../assets/styles/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";

type QnaCardLecturerProps = {
  question: string;
  answer?: string;
  author?: string;
  design?: 1 | 2 | 3;
  onAnswer?: (answer: string) => void;
};

const designStyles = {
  1: css`
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  `,
  2: css`
    background-color: ${theme.colors.header};
    color: ${theme.colors.text_B};
    border: 3px solid rgba(255, 255, 255, 0.7);
    border-radius: 3px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  `,
  3: css`
    background-color: ${theme.colors.background_B};
    color: ${theme.colors.text_D};
    border: 3px solid ${theme.colors.header};
    border-radius: 3px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  `,
};

const CardContainer = styled.div<{ design: 1 | 2 | 3 }>`
  position: relative;
  width: 700px;
  padding: 16px;
  margin: 12px 0;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  line-height: 1.4;
  ${({ design }) => designStyles[design]}
`;

const QuestionText = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  word-break: break-word;
`;

const AnswerText = styled.div`
  font-size: 0.95rem;
  white-space: pre-wrap;
  font-weight: 400;
  word-break: break-word;
`;

const AnswerInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  font-size: 1rem;
  padding: 8px;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  border-radius: 6px;
  border: 1px solid ${theme.colors.primary};
  resize: vertical;
  &:focus {
    outline: none;
    box-shadow: 0 0 5px ${theme.colors.primary};
  }
`;

const ConfirmButton = styled.button<{ design: 1 | 2 | 3 }>`
  margin-top: 8px;
  padding: 6px 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: green;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EditButton = styled(ConfirmButton)`
  color: ${theme.colors.primary};
`;

const Divider = styled.hr<{ design: 1 | 2 | 3 }>`
  margin: 16px 0 12px;
  border: none;
  border-top: 2px solid;
  ${({ design }) =>
    design === 1 &&
    css`
      border-color: #ccc;
    `}
  ${({ design }) =>
    design === 2 &&
    css`
      border-color: #ffffff55;
    `}
  ${({ design }) =>
    design === 3 &&
    css`
      border-color: ${theme.colors.disable};
    `}
`;

const AuthorText = styled.div`
  margin-top: 12px;
  font-size: 0.85rem;
  text-align: right;
  color: #888;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
`;

const ToggleButton = styled.button<{ design: 1 | 2 | 3 }>`
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  &:hover {
    text-decoration: underline;
  }
  ${({ design }) =>
    design === 1 &&
    css`
      color: ${theme.colors.primary};
    `}
  ${({ design }) =>
    design === 2 &&
    css`
      color: #3c7affff;
    `}
  ${({ design }) =>
    design === 3 &&
    css`
      color: ${theme.colors.primary};
    `}
`;

const AnswerWrapper = styled.div<{
  $isOpen: boolean;
  $maxHeight: number;
  $isEditing: boolean;
}>`
  overflow: hidden;
  transition: max-height 0.4s ease;
  max-height: ${({ $isEditing, $isOpen, $maxHeight }) =>
    $isEditing ? "none" : $isOpen ? `${$maxHeight}px` : "0"};
`;

const ContentInner = styled.div`
  padding-top: 0;
`;

// 사용법:
// const handleAnswer = (id: number, newAnswer: string) => {
//   setQnaList((prev) =>
//     prev.map((item) =>
//       item.id === id
//         ? {
//             ...item,
//             answer: newAnswer,
//             author: "김강사", // 나중에 리덕스 유저 정보에서 추출
//           }
//         : item
//     )
//   );
// };

// {qnaList.map(({ id, question, answer, author }) => (
//           <QnaCardLecturer
//             key={id}
//             question={question}
//             answer={answer}
//             author={author}
//             design={1}
//             onAnswer={(newAnswer) => handleAnswer(id, newAnswer)}
//           />
//         ))}

/**
 * 공통 강사용 Q&A 카드 컴포넌트입니다.
 *
 * @component
 * @param {string} question - 질문 (필수!): Q&A의 질문 내용
 * @param {string} [answer] - 답변 (선택): Q&A의 답변 내용
 * @param {string} [author] - 답변 작성자 (선택): 답변을 작성한 사람
 * @param {1 | 2 | 3} [design=1] - 스타일 디자인 번호 (1, 2, 3): 카드 디자인 스타일을 설정하는 번호
 * @param {(answer: string) => void} [onAnswer] - 답변 입력 후 실행될 함수: 답변을 제출할 때 호출되는 함수
 */
const QnaCardLecturer: React.FC<QnaCardLecturerProps> = ({
  question,
  answer,
  author,
  design = 1,
  onAnswer,
}) => {
  const [newAnswer, setNewAnswer] = useState(answer ?? "");
  const [isEditing, setIsEditing] = useState(!answer);
  const [isOpen, setIsOpen] = useState(!answer); // 답변 없으면 기본 열림

  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    }
  }, [answer, newAnswer, isEditing]);

  const handleSubmit = () => {
    const trimmed = newAnswer.trim();
    if (trimmed) {
      onAnswer?.(trimmed);
      setIsEditing(false);
      setIsOpen(true); // 제출 후 펼쳐진 상태 유지
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsOpen(true);
  };

  return (
    <CardContainer design={design}>
      <QuestionText>{question}</QuestionText>

      {answer && !isEditing && (
        <ToggleContainer>
          <ToggleButton design={design} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "닫기 ▲" : "더보기 ▼"}
          </ToggleButton>
        </ToggleContainer>
      )}

      <AnswerWrapper
        $isOpen={isOpen || isEditing}
        $isEditing={isEditing}
        $maxHeight={maxHeight + 20}
      >
        <ContentInner ref={contentRef}>
          <Divider design={design} />

          {isEditing ? (
            <>
              <AnswerInput
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="답변을 입력하세요..."
              />
              <ConfirmButton design={design} onClick={handleSubmit}>
                <FontAwesomeIcon icon={faCheck} />
                확인
              </ConfirmButton>
            </>
          ) : (
            <>
              <AnswerText>{answer}</AnswerText>
              {author && <AuthorText>- {author}</AuthorText>}
              <EditButton design={design} onClick={handleEditClick}>
                <FontAwesomeIcon icon={faPen} />
                수정
              </EditButton>
            </>
          )}
        </ContentInner>
      </AnswerWrapper>
    </CardContainer>
  );
};

export default QnaCardLecturer;
