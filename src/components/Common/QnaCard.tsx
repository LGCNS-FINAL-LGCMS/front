import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../assets/styles/theme";

type QnaCardProps = {
  question: string;
  answer?: string;
  author?: string;
  design?: 1 | 2 | 3;
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
  width: 700px;
  padding: 16px;
  margin: 12px 0;
  transition: height 0.3s ease;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  line-height: 1.4;

  ${({ design }) => designStyles[design]}
`;

const QuestionText = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  word-break: break-word;
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

const AnswerWrapper = styled.div<{ isOpen: boolean; maxHeight: number }>`
  overflow: hidden;
  transition: max-height 0.4s ease;
  max-height: ${({ isOpen, maxHeight }) => (isOpen ? `${maxHeight}px` : "0")};
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

/**
 * 공통 Q&A 카드 컴포넌트입니다. *
 * @param question 질문 (필수!!)
 * @param answer 답변
 * @param author 답변 작성자
 * @param design 스타일 디자인 번호(1,2,3)
 */
const QnaCard: React.FC<QnaCardProps> = ({
  question,
  answer,
  author,
  design = 1,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (answer && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    }
  }, [answer, author]);

  return (
    <CardContainer design={design}>
      <QuestionText>{question}</QuestionText>

      {answer && (
        <ToggleContainer>
          <ToggleButton design={design} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "닫기 ▲" : "더보기 ▼"}
          </ToggleButton>
        </ToggleContainer>
      )}

      {answer && (
        <AnswerWrapper isOpen={isOpen} maxHeight={maxHeight + 20}>
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

export default QnaCard;
