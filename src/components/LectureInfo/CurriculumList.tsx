import React from "react";
import styled from "styled-components";

const ScrollableLeftPane = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 2rem - ${530}px);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray_L};
    border-radius: 10px;
  }
`;

const Lesson = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background_B};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

interface CurriculumListProps {
  lessons: { title: string; duration: string }[];
}

const CurriculumList: React.FC<CurriculumListProps> = ({ lessons }) => {
  return (
    <ScrollableLeftPane>
      {lessons.map((lesson, idx) => (
        <Lesson key={idx}>
          {lesson.title} ({lesson.duration})
        </Lesson>
      ))}
    </ScrollableLeftPane>
  );
};

export default CurriculumList;
