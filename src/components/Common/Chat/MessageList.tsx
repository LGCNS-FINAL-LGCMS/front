import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import type { ChatMessage } from "../../../types/message";
import { theme } from "../../../assets/styles/theme";

interface MessageListProps {
  messages: ChatMessage[];
}

const Container = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

const MessageWrapper = styled.div<{ isUser: boolean }>`
  text-align: ${({ isUser }) => (isUser ? "right" : "left")};
  margin-bottom: 10px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 19px;
  max-width: 80%;
  color: ${({ theme }) => theme.colors.text_B};
  background-color: ${({ isUser, theme }) =>
    isUser ? theme.colors.header : theme.colors.primary};
`;

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container ref={containerRef}>
      {messages.map((msg) => (
        <MessageWrapper key={msg.id} isUser={msg.sender === "user"}>
          <MessageBubble isUser={msg.sender === "user"}>
            {msg.content}
          </MessageBubble>
        </MessageWrapper>
      ))}
    </Container>
  );
};

export default MessageList;
