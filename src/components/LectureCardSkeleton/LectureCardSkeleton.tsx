import React from "react";
import styled, { keyframes } from "styled-components";

interface SkeletonProps {
  width?: string;
}

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonWrapper = styled.div<{ width: string; height: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 3px;
  overflow: hidden;
  background-color: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
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
  padding-top: 100%;
`;

const ContentSkeleton = styled.div`
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const LectureCardSkeleton: React.FC<SkeletonProps> = ({ width = "250px" }) => {
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
    <SkeletonWrapper width={width} height={height}>
      <ImageSkeleton />
      <ContentSkeleton>
        <TitleSkeleton />
        <DescriptionSkeleton />
        <InstructorSkeleton />
      </ContentSkeleton>
    </SkeletonWrapper>
  );
};

export default LectureCardSkeleton;
