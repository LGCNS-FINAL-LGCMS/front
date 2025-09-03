import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
// import { PAGE_PATHS } from "../../constants/pagePaths";
import styled from "styled-components";
import Button from "../Common/Button";
import { theme } from "../../assets/styles/theme";
import { postCartItem } from "../../api/Cart/cartAPI";
import type { LectureResponse } from "../../api/LectureInfo/lectureInfoAPI";
import { PAGE_PATHS } from "../../constants/pagePaths";

const TopSection = styled.div`
  display: flex;
  gap: 2rem;
  padding-bottom: 2rem;
  flex-shrink: 0;
`;

const Thumbnail = styled.img`
  width: 100%;
  max-width: 450px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.colors.gray_L};
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_D};
`;

const Instructor = styled.div`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.gray_D};
  margin-bottom: 1rem;
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.text_D};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ProgressWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.gray_M};
  overflow: hidden;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.success} 100%
  );
  border-radius: 14px;
  transition: width 0.3s ease;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.background_Overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalContent = styled.div<{ isSuccess: boolean }>`
  background: #fff;
  width: ${({ theme }) => theme.size.modal.width};
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  text-align: center;
  animation: fadeIn 0.3s ${({ theme }) => theme.transition.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h2 {
    font-size: ${({ theme }) => theme.fontSize.title.max};
    color: ${({ isSuccess, theme }) =>
      isSuccess ? theme.colors.success : theme.colors.danger};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    font-size: ${({ theme }) => theme.fontSize.body.max};
    color: ${({ theme }) => theme.colors.text_D};
    margin: 0;
  }
`;

interface LectureHeaderProps {
  lecture: LectureResponse | undefined;
  purchased: boolean | undefined;
  progress: number;
}

const LectureInfoHeader: React.FC<LectureHeaderProps> = ({
  lecture,
  purchased,
  progress,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAddCart = async () => {
    try {
      if (!lecture) return;
      await postCartItem({
        lectureId: lecture.lectureId,
        title: lecture.title,
        price: lecture.price,
        thumbnailUrl: lecture.thumbnail,
      });
      setModalMessage("장바구니 담기 성공");
      setIsSuccess(true);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setModalMessage("장바구니 담기 실패");
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    <>
      <TopSection>
        <Thumbnail src={lecture?.thumbnail ?? ""} alt="강의 썸네일" />
        <Info>
          <div>
            <Title>{lecture?.title ?? "제목 없음"}</Title>
            <Instructor>강사: {lecture?.nickname ?? "알 수 없음"}</Instructor>
            <Description>
              {lecture?.description ?? "강의 설명이 없습니다."}
            </Description>
          </div>
          {!purchased ? (
            <ButtonRow>
              <Price>{lecture?.price?.toLocaleString() ?? 0}원</Price>
              <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
                <Button
                  text="수강신청"
                  onClick={() => alert("수강신청")}
                  design={1}
                />
                <Button text="장바구니" onClick={handleAddCart} design={1} />
              </div>
            </ButtonRow>
          ) : (
            <ButtonRow>
              <div style={{ flex: 1 }}>
                <ProgressWrapper>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: theme.colors.text_D,
                      fontWeight: 600,
                    }}
                  >
                    진행률: {progress ?? 0}%
                  </div>
                  <ProgressBar progress={progress ?? 0} />
                </ProgressWrapper>
              </div>
              <Button
                text="자료 다운로드"
                onClick={async () => {
                  if (!lecture?.textbook) return;

                  try {
                    const res = await fetch(lecture.textbook);
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download =
                      lecture.textbook.split("/").pop() ?? "file.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("파일 다운로드 실패", err);
                  }
                }}
                design={1}
              />
              <Button
                text="강의 들으러 가기"
                onClick={() =>
                  navigate(`${PAGE_PATHS.LESSON_VIEW}/${lecture?.lectureId}`)
                }
                design={1}
              />
            </ButtonRow>
          )}
        </Info>
      </TopSection>

      {modalOpen && (
        <ModalBackdrop onClick={() => setModalOpen(false)}>
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            isSuccess={isSuccess}
          >
            <h2>
              <FontAwesomeIcon
                icon={isSuccess ? faCircleCheck : faCircleXmark}
                size="2x"
              />
              {isSuccess ? "성공" : "실패"}
            </h2>
            <p>{modalMessage}</p>
            <Button
              text="확인"
              onClick={() => setModalOpen(false)}
              design={1}
            />
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};

export default LectureInfoHeader;
