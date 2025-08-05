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
}

const ChatContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 300px;
  height: 400px;
  background-color: ${({ theme }) => theme.colors.header};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;

  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};

  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const ChatHeader = styled.div`
  padding: 10px;
  color: ${({ theme }) => theme.colors.text_B};
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  border-bottom: 2px solid ${({ theme }) => theme.colors.background_B};
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text_B};
  cursor: pointer;
  font-size: 16px;
`;

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  messages,
  onSend,
  onClose,
}) => {
  return (
    <ChatContainer isOpen={isOpen}>
      <ChatHeader>
        서비스 챗봇
        <CloseButton onClick={onClose}>✖</CloseButton>
      </ChatHeader>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </ChatContainer>
  );
};

export default ChatWindow;
