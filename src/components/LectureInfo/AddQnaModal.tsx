import React, { useState } from "react";
import styled from "styled-components";
import Button from "../Common/Button";

interface AddQnaModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    lectureId: string;
  }) => void;
  lectureId: string | undefined;
}

const Overlay = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  position: fixed;
  font-family: ${({ theme }) => theme.font.primary};

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background_Overlay};
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  text-align: center; // 중앙 정렬
  color: ${({ theme }) => theme.colors.text_D};
  margin: 0 0 16px 0; // 아래 여백 16px
`;

const ModalContainer = styled.div`
  width: 400px;
  background-color: ${({ theme }) => theme.colors.background_B};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray_M};
  font-size: ${({ theme }) => theme.fontSize.body.max};
`;

const TextArea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray_M};
  font-size: ${({ theme }) => theme.fontSize.body.max};
  resize: none;
  height: 120px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSize.small.max};
`;

const AddQnaModal: React.FC<AddQnaModalProps> = ({
  visible,
  onClose,
  onSubmit,
  lectureId,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({ title: "", content: "" });

  const handleSubmit = () => {
    const newErrors = {
      title: title.trim() ? "" : "제목을 입력해주세요.",
      content: content.trim() ? "" : "내용을 입력해주세요.",
    };
    setErrors(newErrors);

    if (newErrors.title || newErrors.content) return;
    if (!lectureId) return;
    onSubmit({ title, content, lectureId });
    setTitle("");
    setContent("");
    setErrors({ title: "", content: "" });
    onClose();
  };

  return (
    <Overlay visible={visible}>
      <ModalContainer>
        <ModalTitle>문의 작성</ModalTitle>
        <div>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </div>
        <div>
          <TextArea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
        </div>
        <ButtonRow>
          <Button text="취소" onClick={onClose} design={2} />
          <Button text="작성" onClick={handleSubmit} design={1} />
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
};

export default AddQnaModal;
