import React from "react";
import styled, { css } from "styled-components";
import Button from "./Button";

interface ActionButton {
  label: string;
  onClick: () => void;
}

interface LectureCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  lecturer?: string;
  design?: 1 | 2 | 3;
  fontColor?: 1 | 2;
  width?: string;
  buttons?: ActionButton[];
  progress?: number;
  rating?: number | null;
  price?: number;
  reviewCount?: number;
  onCardClick?: () => void;
}

const designStyles = {
  1: css`
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    box-shadow: 0 9px 16px rgba(159, 162, 191, 0.08),
      0px 2px 2px rgba(159, 162, 191, 0.12);
  `,
  2: css`
    background-color: ${({ theme }) => theme.colors.header};
    color: ${({ theme }) => theme.colors.text_B};
    border-radius: 3px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  `,
  3: css`
    background-color: ${({ theme }) => theme.colors.background_B};
    border-radius: 3px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  `,
};

const fontColorStyles = {
  1: css`
    color: ${({ theme }) => theme.colors.text_B};
  `,
  2: css`
    color: ${({ theme }) => theme.colors.text_D};
  `,
};

const Card = styled.div<{
  $design: 1 | 2 | 3;
  width: string;
  height: string;
  clickable: boolean;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  overflow: hidden;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
  ${({ $design }) => designStyles[$design]};

  &:hover {
    box-shadow: 0 1px 25px rgba(0, 0, 0, 0.3);
    transform: scale(1.02);
  }

  &:hover .overlay {
    opacity: 1;
    pointer-events: auto;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background-color: #f0f0f0;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "fontColor",
})<{ fontColor?: 1 | 2 }>`
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  ${({ fontColor }) => fontColor && fontColorStyles[fontColor]};
`;

const Title = styled.h3`
  font-size: clamp(0.8rem, 1.2vw, 1.1rem);
  font-weight: 700;
  margin: 0;
  color: inherit;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Description = styled.p`
  font-size: clamp(0.65rem, 1vw, 0.9rem);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
`;

const Instructor = styled.span`
  font-size: clamp(0.6rem, 0.9vw, 0.8rem);
  font-weight: 400;
  color: inherit;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  transition: opacity 0.3s ease-in-out;
  z-index: 2;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  height: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-top: 10px;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ theme }) => theme.colors.success};
  border-radius: 5px;
  transition: width 0.3s ease;
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ReviewCount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text_D};
`;

const Star = styled.span`
  color: #ffcc00;
  font-size: 1rem;
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.background_D};
  margin-top: 8px;
`;

const LectureCard: React.FC<LectureCardProps> = ({
  imageUrl,
  title,
  description,
  lecturer,
  design = 1,
  fontColor,
  width = "250px",
  buttons = [],
  progress,
  rating,
  reviewCount,
  price,
  onCardClick,
}) => {
  const getHeightFromWidth = (widthValue: string) => {
    const match = widthValue.match(/^(\d+)(px)?$/);
    if (match) {
      const numericWidth = parseInt(match[1], 10);
      return `${Math.round(numericWidth * 1.35)}px`;
    }
    return `calc(${widthValue} * 1.4)`;
  };

  const height = getHeightFromWidth(width);
  const limitedButtons = buttons.slice(0, 3);
  const clickable = limitedButtons.length === 0 && !!onCardClick;

  return (
    <Card
      $design={design}
      width={width}
      height={height}
      clickable={clickable}
      onClick={() => {
        if (limitedButtons.length === 0 && onCardClick) {
          onCardClick();
        }
      }}
    >
      <ImageWrapper>
        {imageUrl && <Image src={imageUrl} alt={title} />}
      </ImageWrapper>

      {progress !== undefined && progress >= 0 && progress <= 100 && (
        <ProgressWrapper>
          <ProgressBar progress={progress} />
        </ProgressWrapper>
      )}

      <Content fontColor={fontColor}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Instructor>{lecturer}</Instructor>

        {rating != null && rating >= 0 && rating <= 5 && (
          <RatingWrapper>
            {[...Array(Math.floor(rating))].map((_, idx) => (
              <Star key={idx}>★</Star>
            ))}
            {rating % 1 !== 0 && <Star>☆</Star>}
            {rating % 1 !== 0 && <span>({rating?.toFixed(1)})</span>}
            {reviewCount != null && reviewCount > 0 && (
              <ReviewCount>({reviewCount}개 리뷰)</ReviewCount>
            )}
          </RatingWrapper>
        )}

        {(price !== null || price !== null) && (
          <Price>{price?.toLocaleString()} 원</Price>
        )}
      </Content>

      {limitedButtons.length > 0 && (
        <Overlay className="overlay">
          {limitedButtons.map((btn, idx) => (
            <Button
              key={idx}
              text={btn.label}
              onClick={() => {
                btn.onClick();
              }}
              design={1}
              fontColor={1}
              fontWeight={700}
            />
          ))}
        </Overlay>
      )}
    </Card>
  );
};

export default LectureCard;
