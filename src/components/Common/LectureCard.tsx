import React from "react";
import styled, { css } from "styled-components";

interface LectureCardProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
  description?: string;
  lecturer?: string;
  design?: 1 | 2 | 3;
  fontColor?: 1 | 2;
  width?: string;
}

const designStyles = {
  1: css`
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  design: 1 | 2 | 3;
  width: string;
  height: string;
  onClick?: () => void;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  ${({ design }) => designStyles[design]}

  &:hover {
    transform: ${({ onClick }) => (onClick ? "scale(1.02)" : "none")};
    box-shadow: 0 1px 25px rgba(0, 0, 0, 0.3);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
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

const Content = styled.div<{
  fontColor?: 1 | 2;
}>`
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${({ fontColor }) => fontColor && fontColorStyles[fontColor]};
  font-weight: 400;
`;

const Title = styled.h3`
  font-size: clamp(0.8rem, 1.2vw, 1.1rem);
  font-weight: 700;
  margin: 0;
  color: inherit;
`;

const Description = styled.p`
  font-size: clamp(0.65rem, 1vw, 0.9rem);
  margin: 0;
  color: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Instructor = styled.span`
  font-size: clamp(0.6rem, 0.9vw, 0.8rem);
  font-weight: 400;
  color: inherit;
`;

/**
 * 공통 강의 카드 컴포넌트입니다. *
 * @param imageUrl 입력될 값 (필수!!)
 * @param title 제목 (필수!!)
 * @param onClick 클릭 이벤트 (필수!!)
 * @param lecturer 강사 이름 텍스트
 * @param description 설명 텍스트
 * @param design 스타일 디자인 번호(1,2,3)
 * @param fontColor 버튼 폰트 색상(1,2) *
 * @param width 너비 ex) width="300px"
 */
const LectureCard: React.FC<LectureCardProps> = ({
  imageUrl,
  title,
  description,
  lecturer,
  onClick,
  design = 1,
  fontColor,
  width = "250px",
}) => {
  const getHeightFromWidth = (widthValue: string) => {
    const match = widthValue.match(/^(\d+)(px)?$/);
    if (match) {
      const numericWidth = parseInt(match[1], 10);
      return `${Math.round(numericWidth * 1.4)}px`;
    }
    return `calc(${widthValue} * 1.4)`;
  };

  const height = getHeightFromWidth(width);

  return (
    <Card
      onClick={onClick}
      design={design}
      width={width}
      height={height}
      role="button"
    >
      <ImageWrapper>
        <Image src={imageUrl} alt={title} />
      </ImageWrapper>
      <Content fontColor={fontColor}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Instructor>{lecturer}</Instructor>
      </Content>
    </Card>
  );
};

export default LectureCard;
