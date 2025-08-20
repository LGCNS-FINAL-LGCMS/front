import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "../Common/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: ${({ theme }) => theme.font.primary};
  color: ${({ theme }) => theme.colors.text_D};
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSize.display};
`;

const DropArea = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.gray_M};
  border-radius: 3px;
  background-color: ${({ $isDragActive, theme }) =>
    $isDragActive ? theme.colors.background_B : "#fafafa"};
  transition: ${({ theme }) => theme.transition.default};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 300px;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  cursor: pointer;
  padding: 24px;
  box-sizing: border-box;

  p {
    margin-top: 8px;
    color: ${({ theme }) => theme.colors.text_D};
    font-size: ${({ theme }) => theme.fontSize.body.min};
    text-align: center;
  }

  svg {
    width: 48px;
    height: 48px;
    opacity: 0.6;
  }
`;

const DropImage = styled.img`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 auto;
`;

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
  background: white;
  padding: 16px;
  border-radius: 8px;
  ${({ theme }) => theme.size.modal};
  max-width: 600px;
  height: 400px;
  display: flex;

  flex-direction: column;
`;

const CropperWrapper = styled.div`
  position: relative;
  flex: 1;
  background: #333;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;
const ModalButtonGroup = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

type UploadedImage = {
  file: File;
  preview: string;
};

type ImageUploaderProps = {
  onFileSelect: (file: File | null, preview?: string) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const preview = URL.createObjectURL(file);

    setOriginalImage({ file, preview });
    setCroppedImage(null);
    setIsModalOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const getCroppedImage = useCallback(async () => {
    if (!originalImage || !croppedAreaPixels) return;
    const imageUrl = await createCroppedImage(
      originalImage.preview,
      croppedAreaPixels
    );
    setCroppedImage(imageUrl);
    setIsModalOpen(false);
    onFileSelect(originalImage.file, imageUrl);
  }, [croppedAreaPixels, originalImage, onFileSelect]);

  const displayedImage = croppedImage || originalImage?.preview || "";

  const hiddenFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleModifyClick = () => {
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const preview = URL.createObjectURL(file);

    setOriginalImage({ file, preview });
    setCroppedImage(null);
    setIsModalOpen(false);

    onFileSelect(file, preview);

    e.target.value = "";
  };

  return (
    <Container>
      {!originalImage ? (
        <DropArea {...getRootProps()} $isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faUpload} />
          {isDragActive ? (
            <p>이미지를 여기에 놓으세요</p>
          ) : (
            <p>클릭하거나 드래그하여 이미지를 업로드하세요</p>
          )}
        </DropArea>
      ) : (
        <>
          <DropImage
            src={displayedImage}
            alt="uploaded-preview"
            onClick={() => setIsModalOpen(true)}
          />
          <ButtonWrapper>
            <Button
              text="이미지 변경"
              onClick={handleModifyClick}
              fontWeight={400}
              design={1}
            />
          </ButtonWrapper>
          <input
            type="file"
            accept="image/*"
            ref={hiddenFileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </>
      )}

      {isModalOpen && originalImage && (
        <ModalOverlay>
          <ModalContent>
            <CropperWrapper>
              <Cropper
                image={originalImage.preview}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </CropperWrapper>
            <ModalButtonGroup>
              <Button
                text="자르기 완료"
                onClick={getCroppedImage}
                fontWeight={700}
                design={2}
              />
              <Button
                fontWeight={700}
                text="취소"
                onClick={() => setIsModalOpen(false)}
                design={2}
              />
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ImageUploader;

async function createCroppedImage(
  imageSrc: string,
  crop: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context 생성 실패");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
