// LessonConfirmModal.tsx
import React from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background_B};
  padding: 24px;
  border-radius: 8px;
  ${({ theme }) => theme.size.modal};
  max-width: 90%;
  box-shadow: ${({ theme }) => theme.shadow.md};
  align-items: center;
  text-align: center;
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-family: ${({ theme }) => theme.font.primary};
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.text_D};
`;

const Message = styled.p`
  margin: 0 0 24px 0;
  font-family: ${({ theme }) => theme.font.primary};
  font-size: ${({ theme }) => theme.fontSize.body.min};
  color: ${({ theme }) => theme.colors.text_D};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button<{ danger?: boolean }>`
  padding: 6px 14px;
  font-size: ${({ theme }) => theme.fontSize.body.min};
  font-weight: 500;
  border: none;
  height: 35px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.font.primary};
  cursor: pointer;
  background-color: ${({ theme, danger }) =>
    danger ? theme.colors.danger : theme.colors.primary};
  color: ${({ theme }) => theme.colors.background_B};
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <Overlay>
      <ModalWrapper>
        {title && <Title>{title}</Title>}
        <Message>{message}</Message>
        <Buttons>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button danger onClick={onConfirm}>
            {confirmText}
          </Button>
        </Buttons>
      </ModalWrapper>
    </Overlay>,
    document.body
  );
};

export default ConfirmModal;
