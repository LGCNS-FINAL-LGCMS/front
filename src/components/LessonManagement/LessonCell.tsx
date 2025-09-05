import React from "react";
import styled from "styled-components";
import type { Lesson } from "../../types/lesson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  lesson: Lesson;
  onDelete: (id: string) => void;
  index: number;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  onEditClick: (lesson: Lesson) => void;
}
const Row = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr 140px 100px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border_Light};
  background-color: ${({ theme }) => theme.colors.background_B};
  font-family: ${({ theme }) => theme.font.primary};
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray_L};
  }
`;

const Thumb = styled.div<{ imageUrl?: string }>`
  width: 120px;
  aspect-ratio: 16 / 9;
  position: relative;
  background-color: ${({ theme }) => theme.colors.gray_M};
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : "")};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

// 제목
const Title = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.text_D};
  width: 100%;
  background: transparent;
  padding-bottom: 2px;
`;

// 설명 텍스트
const SmallText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.small.min};
  color: ${({ theme }) => theme.colors.secondary};
  width: 240px;
  padding-top: 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 액션 버튼
const Actions = styled.div`
  display: flex;
  gap: 12px;
  font-size: ${({ theme }) => theme.fontSize.body.min};
`;

const UpdateButton = styled.span`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  transition: transform 0.2s ease-in-out;

  &:hover svg {
    transform: scale(1.3);
  }

  svg {
    transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
    color: ${({ theme }) => theme.colors.gray_D};
  }

  &:hover svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DeleteButton = styled.span`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  transition: transform 0.2s ease-in-out;

  &:hover svg {
    transform: scale(1.3);
  }

  svg {
    transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
    color: ${({ theme }) => theme.colors.gray_D};
  }

  &:hover svg {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const IndexCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_B};
  background-color: ${({ theme }) => theme.colors.header};
  border-radius: 3px;
  width: 28px;
  height: 28px;
  font-size: ${({ theme }) => theme.fontSize.body.min};
`;

const LessonCell: React.FC<Props> = ({
  lesson,
  index,
  onDelete,
  onEditClick,
}) => {
  const formatDate = (createdAt: number[]) => {
    const [year, month, day] = createdAt;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const safeImageUrl = lesson.thumbnail
    ? encodeURI(lesson.thumbnail)
    : undefined;

  return (
    <Row>
      <IndexCell>{index + 1}</IndexCell>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Thumb imageUrl={safeImageUrl} />
        <div>
          <Title>{lesson.title}</Title>
          <SmallText>{lesson.information}</SmallText>
        </div>
      </div>
      <div>{formatDate(lesson.createdAt)}</div>
      <Actions>
        <UpdateButton onClick={() => onEditClick(lesson)}>
          <FontAwesomeIcon icon={faPen} />
        </UpdateButton>
        <DeleteButton onClick={() => onDelete(lesson.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      </Actions>
    </Row>
  );
};

export default LessonCell;
