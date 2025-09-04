import React from "react";
import styled from "styled-components";
import type { LessonResponse } from "../../api/LectureInfo/lectureInfoAPI";

const ScrollableLeftPane = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 2rem - 530px);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;

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
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  gap: 0.5rem;
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  width: 100%;
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const LessonIndex = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_D};
  flex-shrink: 0;
  width: 2rem;
  text-align: center;
`;

const LessonContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const LessonTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.95rem;
`;

const Playtime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text_D};
  flex-shrink: 0;
  margin-left: 1rem;
`;

interface CurriculumListProps {
  lessons: LessonResponse[];
}

const CurriculumList: React.FC<CurriculumListProps> = ({ lessons }) => {
  const formatPlaytime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (minutes === 0) return `${secs}초`;
    if (secs === 0) return `${minutes}분`;
    return `${minutes}분 ${secs}초`;
  };

  return (
    <ScrollableLeftPane>
      {lessons.map((lesson, idx) => (
        <Lesson key={lesson.id}>
          <LessonIndex>{idx + 1}</LessonIndex>
          <LessonContent>
            <LessonTitle>{lesson.title}</LessonTitle>
            <Playtime>{formatPlaytime(lesson.playtime)}</Playtime>
          </LessonContent>
        </Lesson>
      ))}
    </ScrollableLeftPane>
  );
};

export default CurriculumList;
