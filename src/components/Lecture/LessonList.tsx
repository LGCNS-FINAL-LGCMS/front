// src/components/Lecture/LessonList.tsx

import styled from 'styled-components';
import LessonItem from './LessonItem';

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ListHeader = styled.div`
  padding: 10px;
  font-weight: bold;
  background-color: #f3f3f3;
  border-bottom: 1px solid #ddd;
`;

const ListBody = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px; // 박스 간격
  padding: 10px;
`;

interface LessonInfo {
  id: string;
  title: string;
  lecture: string;
  duration: string;
}

interface LessonListProps {
  lessons: LessonInfo[];
  selectedId: string | null;                    
  onSelect: (id: string) => void;               
}

const LessonList = ({ lessons, selectedId, onSelect }: LessonListProps) => {
  return (
    <ListWrapper>
      <ListHeader>📚 강의 목차</ListHeader>
      <ListBody>
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            data={lesson}
            onClick={() => onSelect(lesson.id)}
            isSelected={lesson.id === selectedId}
          />
        ))}
      </ListBody>
    </ListWrapper>
  );
};



export default LessonList;
