import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import type { Qna } from "../../types/qna";
import { PAGE_PATHS } from "../../constants/pagePaths";

const Card = styled.div`
  padding: 1.5rem 2rem;
  border-radius: 12px;
  font-family: ${({ theme }) => theme.font.primary};
  background-color: #fff;
  box-shadow: ${({ theme }) => theme.shadow.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.lg};
    transform: translateY(-2px);
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_D};
  margin: 0;
`;

const Content = styled.p`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.gray_D};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  font-size: ${({ theme }) => theme.fontSize.small.max};
  color: ${({ theme }) => theme.colors.gray_D};
  align-items: center;
`;

const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

interface QuestionCardProps {
  qna: Qna;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ qna }) => {
  const navigate = useNavigate();
  const answerCount = qna.answers?.length ?? 0;

  const handleClick = (): void => {
    navigate(`${PAGE_PATHS.QNA}/${qna.id}`);
  };

  return (
    <Card onClick={handleClick}>
      <Title>{qna.title}</Title>
      <Content>{qna.content}</Content>
      <Footer>
        <CommentCount>
          <FontAwesomeIcon icon={faComment} />
          {answerCount}
        </CommentCount>
      </Footer>
    </Card>
  );
};

export default QuestionCard;
