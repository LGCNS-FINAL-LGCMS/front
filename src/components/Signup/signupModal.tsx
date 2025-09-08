import Button from "../Common/Button";
import styled from "styled-components";

// import { theme } from "../../assets/styles/theme";

interface InfoCheckModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void; // 확인 클릭 시 함수
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface StyledModalProps {
  $isOpen: boolean;
}

// 어두운 배경 레이어
const SignupMadal = styled.div<StyledModalProps>`
  position: fixed; // 스크롤해도 위치 고정
  top: 0; // 화면 전체
  left: 0;
  right: 0;
  bottom: 0;

  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: ${({ theme }) => theme.zIndex.modal}; // 다른 요소들 위에 표시

  animation: fadeIn 0.2s ease-out; // 부드러운 나타남 효과

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalBox = styled.div`
  width: ${({ theme }) => theme.size.modal.width};

  background-color: ${({ theme }) => theme.colors.text_B};
  background-color: white;
  border-radius: 8px;
  padding: 10px;

  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const ModalMessage = styled.div`
  padding: 30px;
  word-break: keep-all;
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  color: ${({ theme }) => theme.colors.text_D};
  text-align: center;
  white-space: pre-line;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 20px;
`;

const InfoCheckModal: React.FC<InfoCheckModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText,
}) => {
  if (!isOpen) {
    return null;
  }
  return (
    <SignupMadal $isOpen={isOpen} onClick={onCancel}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalMessage>{message}</ModalMessage>
        <ButtonContainer>
          {cancelText && (
            <Button text={cancelText} onClick={onCancel} design={2} />
          )}

          <Button text={confirmText} onClick={onConfirm} design={2} />
        </ButtonContainer>
      </ModalBox>
    </SignupMadal>
  );
};

export default InfoCheckModal;
