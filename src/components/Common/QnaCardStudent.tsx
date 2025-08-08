import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../assets/styles/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck, faPen } from "@fortawesome/free-solid-svg-icons";

type QnaCardStudentProps = {
  question: string;
  answer?: string;
  author?: string;
  design?: 1 | 2 | 3;
  onDelete?: () => void;
  onEdit?: (newQuestion: string) => void;
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
  transition: height 0.3s ease;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  line-height: 1.4;
  ${({ design }) => designStyles[design]}
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button<{ design: 1 | 2 | 3 }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ design }) => (design === 1 ? theme.colors.primary : "#3c7affff")};
  font-weight: 600;
  font-size: 0.9rem;
  padding: 2px 6px;
`;

const EditingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConfirmButton = styled(IconButton)`
  color: green;
`;

const QuestionText = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  word-break: break-word;
`;

const QuestionInput = styled.input`
  font-weight: 700;
  font-size: 1.1rem;
  width: 100%;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${theme.colors.primary};
  outline: none;
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 5px ${theme.colors.primary};
  }
`;

const StyledQuestionInput = styled(QuestionInput)`
  flex-grow: 1;
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

const AnswerWrapper = styled.div<{ $isOpen: boolean; $maxHeight: number }>`
  overflow: hidden;
  transition: max-height 0.4s ease;
  max-height: ${({ $isOpen, $maxHeight }) =>
    $isOpen ? `${$maxHeight}px` : "0"};
`;

const AnswerText = styled.div`
  font-size: 0.95rem;
  white-space: pre-wrap;
  font-weight: 400;
  word-break: break-word;
`;

const AuthorText = styled.div`
  margin-top: 12px;
  font-weight: 400;
  font-size: 0.85rem;
  color: #888;
  text-align: right;
`;

const ContentInner = styled.div`
  padding-top: 0;
`;

// 사용법:
//   const [qnaList, setQnaList] = useState([
//     {
//       id: 1,
//       question: "React란 무엇인가요?",
//       answer: "React는 UI 라이브러리입니다.",
//       author: "홍길동",
//     },
//   ]);

//   const handleEdit = (id: number, newquestion: string) => {
//     setQnaList((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, question: newquestion } : item
//       )
//     );
//   };

//   const handleDelete = (id: number) => {
//     setQnaList((prev) => prev.filter((item) => item.id !== id));
//   };

//   {
//     qnaList.map(({ id, question, answer, author }) => (
//       <QnaCardStudent
//         key={id}
//         question={question}
//         answer={answer}
//         author={author}
//         onDelete={() => handleDelete(id)}
//         onEdit={(e) => handleEdit(id, e)}
//       />
//     ));
//   }

/**
 * 공통 학생용 Q&A 카드 컴포넌트입니다.
 *
 * @component
 * @param {string} question - 질문 (필수!)
 * @param {string} [answer] - 답변
 * @param {string} [author] - 답변 작성자
 * @param {1 | 2 | 3} [design=1] - 스타일 디자인 번호 (1, 2, 3)
 * @param {() => void} [onDelete] - 삭제 버튼 클릭 시 실행될 함수
 * @param {(newQuestion: string) => void} [onEdit] - 수정 완료 시 실행될 함수
 */
const QnaCardStudent: React.FC<QnaCardStudentProps> = ({
  question,
  answer,
  author,
  design = 1,
  onDelete,
  onEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (answer && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    }
  }, [answer, author]);

  // question prop이 바뀔 때 editedQuestion 초기화
  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleConfirmClick = () => {
    if (editedQuestion.trim() === "") {
      setEditedQuestion(question);
    } else if (editedQuestion !== question) {
      onEdit?.(editedQuestion.trim());
    }
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      onDelete?.();
    }
  };

  return (
    <CardContainer design={design}>
      <ButtonGroup>
        {!isEditing && (
          <>
            <IconButton design={design} onClick={handleEditClick} title="수정">
              <FontAwesomeIcon icon={faPen} />
            </IconButton>
            <IconButton
              design={design}
              onClick={handleDeleteClick}
              title="삭제"
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </>
        )}
      </ButtonGroup>

      {isEditing ? (
        <EditingWrapper>
          <StyledQuestionInput
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirmClick();
              }
            }}
          />
          <ConfirmButton
            design={design}
            onClick={handleConfirmClick}
            title="확인"
          >
            <FontAwesomeIcon icon={faCheck} />
          </ConfirmButton>
        </EditingWrapper>
      ) : (
        <QuestionText>{question}</QuestionText>
      )}

      {answer && (
        <ToggleContainer>
          <ToggleButton design={design} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "닫기 ▲" : "더보기 ▼"}
          </ToggleButton>
        </ToggleContainer>
      )}

      {answer && (
        <AnswerWrapper $isOpen={isOpen} $maxHeight={maxHeight + 20}>
          <ContentInner ref={contentRef}>
            <Divider design={design} />
            <AnswerText>{answer}</AnswerText>
            {author && <AuthorText>- {author}</AuthorText>}
          </ContentInner>
        </AnswerWrapper>
      )}
    </CardContainer>
  );
};

export default QnaCardStudent;
