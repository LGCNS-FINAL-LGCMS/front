import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import ImageUploader from "../../components/CreateLecture/ImageUploader";
import LectureMaterialsUploader from "../../components/CreateLecture/LectureMaterialUploader";
import InterestSelector from "../../components/Common/InterestSelector";
import Button from "../../components/Common/Button";
import { getcategoriesList } from "../../api/Signup/signupAPI";
import type { Interest } from "../../types/interset";
import {
  openLectureRequest,
  lectureFilesUpload,
} from "../../api/Lecture/lectureAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";

const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
`;

interface RadioButtonProps {
  selected: boolean;
}

const RadioButton = styled.button<RadioButtonProps>`
  padding: 6px 12px;
  border: 3px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.header : theme.colors.gray_M};
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.gray_D : "white"};
  color: ${({ selected, theme }) => (selected ? "white" : theme.colors.text_D)};
  border-radius: 6px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.body.min};

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.colors.gray_D : theme.colors.gray_L};
  }
`;

const Container = styled.div`
  max-width: 800px;
  font-family: ${({ theme }) => theme.font.primary};
  color: ${({ theme }) => theme.colors.text_D};
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  margin-bottom: 2px;
`;

const Underline = styled.div`
  width: 110%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.header};
  margin: 0px 0 24px 0;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 1px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleLabel = styled.div<{ active: boolean }>`
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.header : theme.colors.gray_M};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const ToggleCircle = styled.div<{ active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 2px;
  left: ${({ active }) => (active ? "18px" : "2px")};
  transition: left 0.3s;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.title};
  font-weight: 700;
`;

const Input = styled.input`
  padding: 8px 12px;
  font-family: ${({ theme }) => theme.font.primary};
  font-weight: 400;
  border: 1px solid ${({ theme }) => theme.colors.gray_M};
  border-radius: 6px;
  height: 40px;
  font-size: ${({ theme }) => theme.fontSize.body.min};
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  font-family: ${({ theme }) => theme.font.primary};
  font-weight: 400;
  max-width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray_M};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.fontSize.body.min};
  width: 100%;
  min-height: 100px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const ThumbnailWrapper = styled.div`
  flex: 1 1 200px;
  max-width: 250px;
`;

const InfoWrapper = styled.div`
  flex: 2 1 300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 100px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSize.small.max};
  margin-bottom: 4px;
`;

const ConfirmModal = styled.div`
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
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ConfirmModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  animation: slideUp 0.3s ease;
  font-family: ${({ theme }) => theme.font.primary};

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSize.title};
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.small.max};
  color: ${({ theme }) => theme.colors.text_D};
  margin-top: -10px;
  margin-bottom: 15px;
  line-height: 1.4;
`;

const ConfirmRow = styled.div`
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.fontSize.body.min};

  strong {
    font-weight: 600;
    display: inline-block;
    width: 90px;
  }
`;

const CreateLecturePage = () => {
  const TITLE_MAX_LENGTH = 20;
  const DESCRIPTION_MAX_LENGTH = 40;

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [priceStr, setPriceStr] = useState<string>("");
  const [priceNum, setPriceNum] = useState<number>(0);
  const [isFree, setIsFree] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [information, setInformation] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<"상" | "중" | "하" | "">(
    ""
  );
  const [interests, setInterests] = useState<Interest[]>([]); // 여기를 빈 배열로 초기화
  const nickname = useSelector((state: RootState) => state.auth.nickname);

  const levels: Array<"상" | "중" | "하"> = ["상", "중", "하"];

  const [errors, setErrors] = useState({
    thumbnail: "",
    level: "",
    category: "",
    title: "",
    description: "",
    information: "",
    materials: "",
  });

  const handleFileSelect = (file: File | null) => setSelectedFile(file);
  const handleImageSelect = (file: File | null) => setSelectedImageFile(file);
  const handleSelectionChange = useCallback((selected: Interest[]) => {
    setSelectedInterests(selected);
  }, []);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSave = () => {
    const isValid = validateInputs();

    if (!isValid) return;

    setShowConfirmModal(true);
  };

  const validateInputs = () => {
    const newErrors = {
      thumbnail: selectedImageFile ? "" : "썸네일 이미지를 등록해주세요.",
      level: selectedLevel ? "" : "강의 난이도를 선택해주세요.",
      category:
        selectedInterests.length === 0
          ? "카테고리를 선택해주세요."
          : selectedInterests.length > 1
          ? "카테고리는 하나만 선택할 수 있습니다."
          : "",
      title: title.trim()
        ? title.length > 50
          ? `제목은 ${TITLE_MAX_LENGTH}자 이내로 입력해주세요.`
          : ""
        : "강의 제목을 입력해주세요.",
      description: description.trim() ? "" : "강의 설명을 입력해주세요.",
      information: information.trim() ? "" : "상세 설명을 입력해주세요.",
      materials: selectedFile ? "" : "강의 자료를 업로드해주세요.",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((err) => err === "");
  };

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await getcategoriesList();
        console.log(data);
        setInterests(
          data.data.categories.map((cat: { id: number; name: string }) => ({
            id: cat.id,
            name: cat.name.replace(/^"|"$/g, ""),
          }))
        );
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
        setInterests([]);
      }
    };

    fetchInterests();
  }, []);

  return (
    <Container>
      <PageTitle>강의 개설 신청</PageTitle>
      <Underline />
      <TopSection>
        <ThumbnailWrapper>
          <Section>
            <SectionTitle>강의 썸네일</SectionTitle>
            <SectionSubtitle>
              강의 개설 시 보여질 썸네일을 업로드 해주세요
            </SectionSubtitle>
            {errors.thumbnail && (
              <ErrorMessage>{errors.thumbnail}</ErrorMessage>
            )}
            <ImageUploader onFileSelect={handleImageSelect} />
          </Section>
        </ThumbnailWrapper>

        <InfoWrapper>
          <Section>
            <SectionTitle>강의 난이도</SectionTitle>
            <SectionSubtitle>강의 난이도를 선택해 주세요.</SectionSubtitle>
            {errors.level && <ErrorMessage>{errors.level}</ErrorMessage>}
            <RadioGroup>
              {levels.map((level) => (
                <RadioButton
                  key={level}
                  selected={selectedLevel === level}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </RadioButton>
              ))}
            </RadioGroup>
          </Section>

          <Section>
            <SectionTitle>강의 가격</SectionTitle>
            <ToggleWrapper>
              <ToggleLabel
                active={isFree}
                onClick={() => {
                  setIsFree((prev) => !prev);
                  if (!isFree) {
                    setPriceStr("");
                    setPriceNum(0);
                  }
                }}
              >
                <ToggleCircle active={isFree} />
              </ToggleLabel>
              <Input
                type="text"
                placeholder={isFree ? "무료" : "가격 입력"}
                value={isFree ? "" : priceStr}
                onChange={(e) => {
                  if (!isFree) {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    setPriceStr(
                      numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    );
                    setPriceNum(numericValue ? parseInt(numericValue) : 0);
                  }
                }}
              />
            </ToggleWrapper>
          </Section>
        </InfoWrapper>
      </TopSection>

      <Section>
        <SectionTitle>카테고리</SectionTitle>
        <SectionSubtitle>강의 카테고리를 추가해주세요.</SectionSubtitle>
        {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        <InterestSelector
          interests={interests}
          onSelectionChange={handleSelectionChange}
        />
      </Section>

      <Section>
        <SectionTitle>강의 제목</SectionTitle>
        {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        <Input
          placeholder="강의 제목을 입력하세요"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div style={{ textAlign: "right", fontSize: "12px", color: "#888" }}>
          {title.length}/{TITLE_MAX_LENGTH}자
        </div>
      </Section>

      <Section>
        <SectionTitle>강의 한 줄 설명</SectionTitle>
        {errors.description && (
          <ErrorMessage>{errors.description}</ErrorMessage>
        )}
        <Input
          placeholder="강의 설명을 입력하세요 (한 줄 요약)"
          value={description}
          maxLength={DESCRIPTION_MAX_LENGTH}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ textAlign: "right", fontSize: "12px", color: "#888" }}>
          {description.length}/{DESCRIPTION_MAX_LENGTH}자
        </div>
      </Section>

      <Section>
        <SectionTitle>상세 설명</SectionTitle>
        {errors.information && (
          <ErrorMessage>{errors.information}</ErrorMessage>
        )}
        <TextArea
          placeholder="강의에 대한 상세 설명을 입력하세요"
          value={information}
          onChange={(e) => setInformation(e.target.value)}
        />
      </Section>
      <Section>
        <SectionTitle>강의 자료</SectionTitle>
        <SectionSubtitle>강의 자료는 PDF 확장자만 가능합니다.</SectionSubtitle>
        {errors.materials && <ErrorMessage>{errors.materials}</ErrorMessage>}
        <LectureMaterialsUploader onFileSelect={handleFileSelect} />
      </Section>
      <Button
        text="강의 개설"
        onClick={() => {
          handleSave();
        }}
      />
      {showConfirmModal && (
        <ConfirmModal>
          <ConfirmModalContent>
            <h3>입력 내용을 확인해주세요</h3>
            <ConfirmRow>
              <strong>제목:</strong> {title}
            </ConfirmRow>
            <ConfirmRow>
              <strong> 한 줄 설명:</strong> {description}
            </ConfirmRow>
            <ConfirmRow>
              <strong>상세 설명:</strong> {information}
            </ConfirmRow>
            <ConfirmRow>
              <strong>난이도:</strong> {selectedLevel}
            </ConfirmRow>
            <ConfirmRow>
              <strong>가격:</strong>{" "}
              {isFree ? "무료" : `${priceNum.toLocaleString()}원`}
            </ConfirmRow>
            <ConfirmRow>
              <strong>카테고리:</strong>{" "}
              {selectedInterests.map((i) => i.name).join(", ")}
            </ConfirmRow>
            <ConfirmRow>
              <strong>썸네일:</strong> {selectedImageFile?.name}
            </ConfirmRow>
            <ConfirmRow>
              <strong>강의자료:</strong> {selectedFile?.name}
            </ConfirmRow>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                text="취소"
                onClick={() => setShowConfirmModal(false)}
                design={1}
              />
              <Button
                text="제출"
                onClick={async () => {
                  try {
                    if (selectedImageFile == null || selectedFile == null)
                      return;
                    const response = await openLectureRequest({
                      title,
                      category: selectedInterests[0]?.name ?? "",
                      information,
                      level: selectedLevel,
                      price: isFree ? 0 : priceNum,
                      description,
                      nickname: nickname,
                    });

                    console.log(response);
                    const res = await lectureFilesUpload({
                      id: response,
                      files: [selectedImageFile, selectedFile],
                    });

                    console.log("강의 개설 성공!", res);
                    setShowConfirmModal(false);
                    navigate(PAGE_PATHS.USER_PAGE.LECTURER);
                  } catch (error) {
                    console.error("강의 개설 중 오류 발생:", error);
                    alert("강의 개설 중 오류 발생");
                  }
                }}
                design={1}
              />
            </div>
          </ConfirmModalContent>
        </ConfirmModal>
      )}
    </Container>
  );
};

export default CreateLecturePage;
