import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled, { css, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../assets/styles/theme";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  font-family: ${({ theme }) => theme.font.primary};
  color: ${({ theme }) => theme.colors.text_D};
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSize.button.max};
`;

const DropArea = styled.div<{ $isDragActive: boolean }>`
  height: 40px;
  border: 2px solid ${({ theme }) => theme.colors.gray_L};
  border-radius: 8px;
  background-color: ${({ $isDragActive, theme }) =>
    $isDragActive ? theme.colors.background_B : "#fafafa"};
  box-shadow: ${({ $isDragActive }) =>
    $isDragActive ? theme.shadow.sm : theme.shadow.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  width: 100%;
  overflow: hidden;

  ${({ $isDragActive }) =>
    $isDragActive &&
    css`
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.background_B} 00%,
        ${({ theme }) => theme.colors.gray_M} 50%,
        ${({ theme }) => theme.colors.background_B} 100%
      );
      background-size: 800px 100%;
      animation: ${shimmer} 2.1s infinite linear;
    `}
`;

const FileName = styled.p`
  margin: 0;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text_D};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text_D};
  cursor: pointer;
  margin-left: 8px;
  flex-shrink: 0;
`;

const CenteredText = styled.p`
  margin: 0;
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.font.primary};
  color: ${({ theme }) => theme.colors.text_D};
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSize.display};
`;

type UploadedFile = {
  file: File;
};

type LectureMaterialsUploaderProps = {
  onFileSelect: (file: File) => void;
};

const LectureMaterialsUploader: React.FC<LectureMaterialsUploaderProps> = ({
  onFileSelect,
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type !== "application/pdf") {
          alert("PDF 파일만 업로드 가능합니다.");
          return;
        }
        setUploadedFile({ file });
        onFileSelect(file); // 부모에게 파일 전달
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  return (
    <Container>
      <DropArea {...getRootProps()} $isDragActive={isDragActive}>
        <input {...getInputProps()} />

        {uploadedFile ? (
          <>
            <FontAwesomeIcon
              icon={faPaperclip}
              style={{
                fontSize: 20,
                color: theme.colors.primary,
                marginRight: 8,
                flexShrink: 0,
              }}
            />
            <FileName>{uploadedFile.file.name}</FileName>
            <DeleteIcon icon={faTimes} onClick={handleDelete} />
          </>
        ) : (
          <CenteredText>
            {isDragActive
              ? "여기에 파일을 놓으세요"
              : "클릭하거나 드래그하여 강의 자료를 업로드하세요"}
          </CenteredText>
        )}
      </DropArea>
    </Container>
  );
};

export default LectureMaterialsUploader;
