import React from "react";
import styled from "styled-components";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { ChatMessage } from "../../../types/message";

interface ChatWindowProps {
  isOpen: boolean;
  messages: ChatMessage[];
  onSend: (message: string) => void;
  onClose: () => void;
  initialSuggestions?: string[];
}

const ChatContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: max(90px, calc(env(safe-area-inset-bottom) + 16px));
  right: 20px;
  width: min(400px, calc(100vw - 32px));
  height: min(800px, calc(100vh - 115px));
  background-color: ${({ theme }) => theme.colors.header};
  box-shadow: 0 12px 30px ${({ theme }) => theme.shadow.md};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;

  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
  transform: ${({ isOpen }) => (isOpen ? "translateY(0) scale(1)" : "translateY(10px) scale(0.98)")};
  transition: opacity 0.22s ease, transform 0.22s ease;
  will-change: opacity, transform;

  /* 스크롤바운스방지 */
  overscroll-behavior: contain;
`;

const ChatHeader = styled.div`
  padding: 12px 14px;
  color: ${({ theme }) => theme.colors.text_B};
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  border-bottom: 2px solid ${({ theme }) => theme.colors.background_B};
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 헤더영역 또력하게 하기 */
  backdrop-filter: saturate(110%) blur(6px);
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text_B};
  cursor: pointer;
  font-size: 16px;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background-color 0.16s ease, transform 0.06s ease;

  &:hover { background-color: ${({ theme }) => theme.colors.gray_M}; }
  &:active { transform: scale(0.98); }
`;

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  messages,
  onSend,
  onClose,
  initialSuggestions = [],
}) => {
  return (
    <ChatContainer isOpen={isOpen}>
      <ChatHeader>
        서비스 챗봇
        <CloseButton onClick={onClose}>✖</CloseButton>
      </ChatHeader>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} initialSuggestions={initialSuggestions} />
    </ChatContainer>
  );
};

export default ChatWindow;
