import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "../Common/Button";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.background_Overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background_B};
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  font-weight: 600;
  margin: 0;
`;

const Input = styled.input`
  padding: 6px 10px;
  font-family: ${({ theme }) => theme.font.primary};
  font-weight: 400;
  border: 1px solid ${({ theme }) => theme.colors.gray_M};
  border-radius: 6px;
  height: 34px;
  font-size: ${({ theme }) => theme.fontSize.body.min};
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSize.small.max};
  margin-top: -2px;
`;

const DropArea = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.gray_M};
  border-radius: 6px;
  background-color: ${({ $isDragActive, theme }) =>
    $isDragActive ? theme.colors.background_B : "#fafafa"};
  transition: ${({ theme }) => theme.transition.default};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  aspect-ratio: 16 / 9;
  cursor: pointer;
  padding: 16px;
  box-sizing: border-box;

  p {
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.text_D};
    font-size: ${({ theme }) => theme.fontSize.small.max};
    text-align: center;
  }

  svg {
    width: 36px;
    height: 36px;
    opacity: 0.6;
  }
`;

const VideoPreview = styled.video`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  object-fit: cover;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; file?: File }) => void;
  mode?: "upload" | "edit";
  initialData?: { title: string; description: string };
};

const VideoUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "upload",
  initialData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    file: "",
  });

  // 초기값 세팅
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setTitle("");
    setDescription("");
    setErrors({ title: "", description: "", file: "" });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // file은 수정 모드에서는 optional
    onSubmit({ title, description, ...(file && { file }) });
    resetForm();
    onClose();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const selected = acceptedFiles[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
    disabled: mode === "edit", // 수정 모드에서는 드롭 비활성화
  });

  const validate = () => {
    const newErrors = {
      title: title.trim() ? "" : "제목을 입력해주세요.",
      description: description.trim() ? "" : "설명을 입력해주세요.",
      file: mode === "upload" && !file ? "영상을 업로드해주세요." : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Section>
          <SectionTitle>강의 제목</SectionTitle>
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </Section>

        <Section>
          <SectionTitle>강의 설명</SectionTitle>
          {errors.description && (
            <ErrorMessage>{errors.description}</ErrorMessage>
          )}
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="간단한 설명을 입력하세요"
          />
        </Section>

        {mode === "upload" && (
          <Section>
            <SectionTitle>강의 영상</SectionTitle>
            {errors.file && <ErrorMessage>{errors.file}</ErrorMessage>}
            {!previewUrl ? (
              <DropArea {...getRootProps()} $isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <FontAwesomeIcon icon={faUpload} />
                {isDragActive ? (
                  <p>영상을 여기에 놓으세요</p>
                ) : (
                  <p>클릭하거나 드래그하여 영상을 업로드하세요</p>
                )}
              </DropArea>
            ) : (
              <VideoPreview src={previewUrl} controls />
            )}
          </Section>
        )}

        <ButtonGroup>
          <Button
            text="취소"
            onClick={handleClose}
            design={2}
            fontWeight={400}
          />
          <Button
            text={mode === "edit" ? "수정" : "등록"}
            onClick={handleSubmit}
            design={1}
            fontWeight={400}
          />
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VideoUploadModal;
