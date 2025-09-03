import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import LessonContainer from "../../components/LessonManagement/LessonContainer";
import type { Lesson } from "../../types/lesson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import VideoUploadModal from "../../components/LessonManagement/VideoUploadModal";
import {
  postLessonMetadata,
  modifyLessonMetadata,
  deleteLesson,
  getLessonDetails,
  postLessonFiles,
} from "../../api/Lesson/lessonAPI";
import { getLectureById } from "../../api/LectureInfo/lectureInfoAPI";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ theme }) => theme.size.containerMax};
  padding: 24px 0;
  background-color: ${({ theme }) => theme.colors.background_B};
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 80%;
  margin-bottom: 16px;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-family: ${({ theme }) => theme.font.primary};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_D};
  margin: 0;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 80%;
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
  const { lectureId } = useParams<{ lectureId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lectureName, setLectureName] = useState<string>("");

  const handleDelete = (id: string) => {
    try {
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      const res = deleteLesson(id);
      console.log(`해당 강좌 삭제 완료 :${res}`);
    } catch (error) {
      console.log(`강의 삭제 실패: ${error}`);
    }
  };

  const handleEditClick = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!lectureId) return;

    const fetchLessons = async () => {
      try {
        const data = await getLessonDetails(lectureId);
        const res = await getLectureById(lectureId);
        setLectureName(res.lectureResponseDto.title);
        setLessons(data);
      } catch (error) {
        console.error("레슨 데이터를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchLessons();
  }, [lectureId, isDataUpdated]);

  const handleSubmit = async ({
    title,
    description,
    file,
  }: {
    title: string;
    description: string;
    file?: File;
  }) => {
    setIsUploading(true);

    try {
      if (!lectureId) return;

      const payload = {
        title,
        information: description,
      };

      let data;
      if (editingLesson) {
        data = await modifyLessonMetadata(editingLesson.id, description);
        console.log("Metadata modified successfully:", data);
      } else {
        data = await postLessonMetadata(lectureId, payload);
        if (file) {
          const res = await postLessonFiles(data, lectureId, file);
          console.log("Lesson added successfully:", res);
        }
      }

      setIsDataUpdated((prev) => !prev);
    } catch (error) {
      console.error("Error adding metadata:", error);
      alert(
        editingLesson
          ? "강좌 수정에 실패하였습니다"
          : "강좌 추가에 실패하였습니다."
      );
    } finally {
      setIsModalOpen(false);
      setEditingLesson(null);
      setIsUploading(false);
    }
  };

  return (
    <PageWrapper>
      <Toolbar>
        <Title>{lectureName}</Title>
        <div>
          <IconButton
            onClick={() => {
              setEditingLesson(null);
              setIsModalOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
        </div>
      </Toolbar>
      <Container>
        <LessonContainer
          lessons={lessons}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onEditClick={handleEditClick}
        />
      </Container>

      <VideoUploadModal
        isOpen={isModalOpen}
        mode={editingLesson ? "edit" : "upload"}
        initialData={
          editingLesson
            ? {
                title: editingLesson.title,
                description: editingLesson.information,
              }
            : undefined
        }
        onClose={() => {
          setIsModalOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={async ({ title, description, file }) => {
          handleSubmit({ title, description, file });
        }}
        isUploading={isUploading}
      />
    </PageWrapper>
  );
};

export default LessonManagementPage;
