// AddReviewModal.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Button from "../Common/Button";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { ReviewRequest } from "../../api/Review/reviewAPI";

interface AddReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewRequest) => void;
  defaultNickname?: string;
  questions?: { question: string }[];
}

const Overlay = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  position: fixed;
  inset: 0;
  font-family: ${({ theme }) => theme.font.primary};
  background-color: ${({ theme }) => theme.colors.background_Overlay};
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.background_B};
  padding: 24px;
  border-radius: 12px;
  width: ${({ theme }) => theme.size.modal.width};
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const Label = styled.label`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.text_D};
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.gray_L};
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.body.max};
  resize: none;
`;

const StarSelector = styled.div`
  display: flex;
  gap: 4px;
  font-size: 24px;
  cursor: pointer;
`;

const SurveyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.body.max};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

const StyledSelect = styled.select`
  height: 36px;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.gray_M};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger || "#ff4d4f"};
  font-size: ${({ theme }) => theme.fontSize.body.min || "12px"};
  margin-top: -15px;
`;

const MAX_COMMENT_LENGTH = 100;
const MAX_SUGGESTION_LENGTH = 100;

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  visible,
  onClose,
  onSubmit,
  questions = [
    { question: "이번 강의가 도움이 되었나요?" },
    { question: "난이도는 괜찮았나요?" },
  ],
}) => {
  const nickname = useSelector((state: RootState) => state.auth.nickname);
  const [comment, setComment] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [star, setStar] = useState(0);
  const [survey, setSurvey] = useState<number[]>(
    Array(questions.length).fill(1)
  );
  const [errors, setErrors] = useState({
    star: "",
    comment: "",
    suggestion: "",
  });

  const handleSurveyChange = (idx: number, value: number) => {
    const newSurvey = [...survey];
    newSurvey[idx] = value;
    setSurvey(newSurvey);
  };

  const handleCancel = () => {
    // 입력값 초기화
    setComment("");
    setSuggestion("");
    setStar(0);
    setSurvey(Array(questions.length).fill(1));
    // 오류 초기화
    setErrors({
      star: "",
      comment: "",
      suggestion: "",
    });
    // 모달 닫기
    onClose();
  };

  const handleSubmit = () => {
    const newErrors = {
      star: star === 0 ? "별점을 선택해주세요." : "",
      comment:
        comment.trim() === ""
          ? "한줄평을 입력해주세요."
          : comment.length > MAX_COMMENT_LENGTH
          ? `한줄평은 ${MAX_COMMENT_LENGTH}자 이내로 입력해주세요.`
          : "",
      suggestion:
        suggestion.trim() === ""
          ? "강사에게 바라는 점을 입력해주세요."
          : suggestion.length > MAX_SUGGESTION_LENGTH
          ? `강사 개선점은 ${MAX_SUGGESTION_LENGTH}자 이내로 입력해주세요.`
          : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e !== "")) return;

    const payload = {
      nickname,
      comment,
      suggestion,
      star,
      reviewContentRequests: questions.map((q, idx) => ({
        question: q.question,
        answer: survey[idx],
      })),
    };

    onSubmit(payload);

    handleCancel();
  };

  return (
    <Overlay visible={visible}>
      <Modal>
        <Label>별점</Label>
        <StarSelector>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              style={{ color: n <= star ? "#ffcc00" : "#ccc" }}
              onClick={() => setStar(n)}
            >
              ★
            </span>
          ))}
        </StarSelector>
        {errors.star && <ErrorMessage>{errors.star}</ErrorMessage>}

        <Label>한줄평</Label>
        <TextArea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
          {comment.length}/{MAX_COMMENT_LENGTH}
        </div>
        {errors.comment && <ErrorMessage>{errors.comment}</ErrorMessage>}

        <Label>강사에게 바라는 점 / 개선점</Label>
        <TextArea
          rows={2}
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />
        <div style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
          {suggestion.length}/{MAX_SUGGESTION_LENGTH}
        </div>
        {errors.suggestion && <ErrorMessage>{errors.suggestion}</ErrorMessage>}

        <Label>설문</Label>
        {questions.map((q, idx) => (
          <SurveyRow key={idx}>
            <span>{q.question}</span>
            <StyledSelect
              value={survey[idx]}
              onChange={(e) =>
                handleSurveyChange(idx, parseInt(e.target.value))
              }
            >
              <option value={1}>매우 부족</option>
              <option value={2}>부족</option>
              <option value={3}>보통</option>
              <option value={4}>잘함</option>
              <option value={5}>매우 잘함</option>
            </StyledSelect>
          </SurveyRow>
        ))}

        <ButtonRow>
          <Button text="취소" onClick={handleCancel} design={1} />
          <Button text="제출" onClick={handleSubmit} design={1} />
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default AddReviewModal;
