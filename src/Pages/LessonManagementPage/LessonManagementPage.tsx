import React, { useState } from "react";
import styled from "styled-components";
import LessonContainer from "../../components/LessonManagement/LessonContainer";
import type { Lesson } from "../../types/lesson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const contentWidth = "800px";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 24px 0;
  background-color: ${({ theme }) => theme.colors.background_B};
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${contentWidth};
  margin-bottom: 16px;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.title.min};
  font-family: ${({ theme }) => theme.font.primary};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_D};
  margin: 0;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: ${contentWidth};
`;

const IconButton = styled.button<{ danger?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
  color: ${({ theme, danger }) =>
    danger ? theme.colors.danger : theme.colors.gray_D};
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    color: ${({ theme, danger }) =>
      danger ? theme.colors.danger : theme.colors.text_D};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.disable};
    cursor: not-allowed;
  }
`;

const LessonManagementPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "영상 1 제목",
      description: "설명ddd",
      date: "2025. 07. 11.",
      thumbnailUrl: "",
    },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAdd = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "새 강의",
      description:
        "이강의는 어쩌고 저쩌고에 관한 것으로 초보자들이 듣기 아주 좋은",
      date: new Date().toISOString().slice(0, 10).replace(/-/g, ". "),
      thumbnailUrl: "",
    };
    setLessons((prev) => [...prev, newLesson]);
  };

  const handleUpdate = (id: string, updated: Partial<Lesson>) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, ...updated } : lesson
      )
    );
  };

  const handleDelete = (id: string) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  };

  return (
    <PageWrapper>
      <Toolbar>
        <Title>해당 강의 이름이 뜰 예정</Title>
        <div>
          <IconButton onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
        </div>
      </Toolbar>
      <Container>
        <LessonContainer
          lessons={lessons}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </Container>
    </PageWrapper>
  );
};

export default LessonManagementPage;
