import React from "react";
import styled from "styled-components";
import type { Review } from "../../types/review";

const Card = styled.div`
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background_B};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Nickname = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_D};
  margin-right: 8px;
`;

const Stars = styled.div`
  display: flex;
  font-size: 16px;
  color: #ffcc00;
`;

const Star = styled.span`
  margin-right: 2px;
`;

const DateText = styled.div`
  margin-left: auto;
  font-size: ${({ theme }) => theme.fontSize.body.min};
  color: ${({ theme }) => theme.colors.gray_D};
`;

const Comment = styled.div`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text_D};
`;

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { nickname, star, comment, createdAt } = review;

  const date = new Date(createdAt[0], createdAt[1], createdAt[2]);

  return (
    <Card>
      <Header>
        <Nickname>{nickname}</Nickname>
        <Stars>
          {Array.from({ length: Math.floor(star) }).map((_, idx) => (
            <Star key={idx}>★</Star>
          ))}
          {star % 1 !== 0 && <Star>☆</Star>}
        </Stars>
        <DateText>{date.toLocaleDateString()}</DateText>
      </Header>
      <Comment>{comment}</Comment>
    </Card>
  );
};

export default ReviewCard;
