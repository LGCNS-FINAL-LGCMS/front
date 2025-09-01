import React, { useState } from "react";
import styled from "styled-components";
import type { Lesson } from "../../types/lesson";
import LessonCell from "./LessonCell";
import LessonConfirmModal from "../../components/LessonManagement/LessonConfirmModal";

interface Props {
  lessons: Lesson[];
  onDelete: (id: string) => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onEditClick: (lesson: Lesson) => void;
}

const Table = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background_B};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow-y: auto;
`;

const ScrollableContainer = styled.div`
  height: calc(100vh - 290px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.header};
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.colors.header};
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.header};
    border-radius: 10px;
  }

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.header}
    ${({ theme }) => theme.colors.gray_L};
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr 140px 100px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.header};
  color: ${({ theme }) => theme.colors.text_B};
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.primary};
  font-size: ${({ theme }) => theme.fontSize.body.max};
  padding: 12px;
  backdrop-filter: blur(5px);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const LessonContainer: React.FC<Props> = ({
  lessons,
  onDelete,
  selectedIds,
  setSelectedIds,
  onEditClick,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetLesson, setTargetLesson] = useState<Lesson | null>(null);

  const handleDeleteClick = (id: string) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return;

    setTargetLesson(lesson);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetLesson) onDelete(targetLesson.id);
    setModalOpen(false);
  };

  const handleCancelDelete = () => {
    setTargetLesson(null);
    setModalOpen(false);
  };

  return (
    <Table>
      <ScrollableContainer>
        <HeaderRow>
          <div>순서</div>
          <div>강좌</div>
          <div>생성 일자</div>
          <div>액션</div>
        </HeaderRow>

        {lessons.map((lesson, idx) => (
          <LessonCell
            key={lesson.id}
            lesson={{ ...lesson, index: idx }}
            onEditClick={onEditClick}
            onDelete={handleDeleteClick}
            checked={selectedIds.includes(lesson.id)}
            onCheckChange={(checked) =>
              setSelectedIds((prev) =>
                checked
                  ? [...prev, lesson.id]
                  : prev.filter((id) => id !== lesson.id)
              )
            }
          />
        ))}
      </ScrollableContainer>

      <LessonConfirmModal
        isOpen={modalOpen}
        title={targetLesson ? `"${targetLesson.title}" 삭제 확인` : "삭제 확인"}
        message={
          targetLesson
            ? `"${targetLesson.title}" 강의를 정말 삭제하시겠습니까?`
            : "정말 삭제하시겠습니까?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="삭제"
      />
    </Table>
  );
};

export default LessonContainer;
