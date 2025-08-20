import React from "react";
import styled, { keyframes, css } from "styled-components";

interface SkeletonProps {
  width?: string;
  design?: 1 | 2 | 3; // LectureCard와 동일한 design prop 추가
  fontColor?: 1 | 2; // LectureCard와 동일한 fontColor prop 추가
}

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

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

const SkeletonWrapper = styled.div<{
  width: string;
  height: string;
  $design: 1 | 2 | 3;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 3px;
  overflow: hidden;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
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

const SkeletonBox = styled.div`
  background: linear-gradient(
    90deg,
    #bfbfbfff 25%,
    #9d9d9dff 50%,
    #bfbfbfff 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.2s infinite;
`;

const ImageSkeleton = styled(SkeletonBox)`
  width: 100%;
  padding-top: 56.25%; /* LectureCard와 동일한 이미지 비율 */
`;

const ContentSkeleton = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "fontColor",
})<{ fontColor?: 1 | 2 }>`
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 9px; /* LectureCard와 동일한 간격 */
  ${({ fontColor }) => fontColor && fontColorStyles[fontColor]};
`;

const TitleSkeleton = styled(SkeletonBox)`
  height: 18px;
  width: 80%;
  border-radius: 4px;
`;

const DescriptionSkeleton = styled(SkeletonBox)`
  height: 14px;
  width: 100%;
  border-radius: 4px;
`;

const InstructorSkeleton = styled(SkeletonBox)`
  height: 12px;
  width: 50%;
  border-radius: 4px;
`;

const ProgressWrapperSkeleton = styled(SkeletonBox)`
  width: 100%;
  height: 5px;
  border-radius: 5px;
  margin-top: 10px;
`;

const RatingSkeleton = styled(SkeletonBox)`
  height: 16px;
  width: 60px;
  border-radius: 4px;
`;

const PriceSkeleton = styled(SkeletonBox)`
  height: 18px;
  width: 70px;
  border-radius: 4px;
  margin-top: 8px;
`;

const OverlaySkeleton = styled.div`
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

const ButtonSkeleton = styled(SkeletonBox)`
  width: 100px;
  height: 36px;
  border-radius: 4px;
`;

const LectureCardSkeleton: React.FC<SkeletonProps> = ({
  width = "250px",
  design = 1,
  fontColor,
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

  return (
    <SkeletonWrapper width={width} height={height} $design={design}>
      <ImageSkeleton />
      <ProgressWrapperSkeleton />
      <ContentSkeleton fontColor={fontColor}>
        <TitleSkeleton />
        <DescriptionSkeleton />
        <InstructorSkeleton />
        <RatingSkeleton />
        <PriceSkeleton />
      </ContentSkeleton>
      <OverlaySkeleton className="overlay">
        {/* 두 개의 버튼 스켈레톤 추가 (LectureCard의 buttons.slice(0, 3) 기준) */}
        <ButtonSkeleton />
        <ButtonSkeleton />
      </OverlaySkeleton>
    </SkeletonWrapper>
  );
};

export default LectureCardSkeleton;
