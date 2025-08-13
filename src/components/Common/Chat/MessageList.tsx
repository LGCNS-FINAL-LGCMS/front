import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import type { ChatMessage } from "../../../types/message";
import { theme } from "../../../assets/styles/theme";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface MessageListProps {
  messages: ChatMessage[];
}

const Container = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

export const MessageWrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  padding: 0 8px;
  margin: 10px 0;
`;

export const MessageBubble = styled.div<{ isUser: boolean }>`
  position: relative;
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 16px;
  line-height: 1.48;
  font-size: 14px;
  word-break: break-word;
  box-shadow: 0 6px 18px ${theme.shadow.sm};
  animation: pop 180ms cubic-bezier(.2, .8, .2, 1);

  /* 역할별 바탕 */
  color: ${({ isUser }) => (isUser ? '#ffffff' : '#1f2430')};
  background: ${({ isUser }) =>
    isUser
      ? 'linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)'
      : '#ffffff'};
  border: ${({ isUser }) => (isUser ? 'none' : '1px solid #E7ECFF')};

  left: ${({ isUser }) => (isUser ? 'auto' : '-11px')};
  right: ${({ isUser }) => (isUser ? '-11px' : 'auto')};
  
  @keyframes pop {
    0% {  
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  transition: background-color 0.16s ease, transform 0.06s ease;
  cursor: pointer;
  &:hover {
    background-color: ${({ isUser }) => (isUser ? '#4a7cd9' : '#f0f0f0')};
    transform: scale(1.02);
  }
    `;


const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);



  // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);

  const openPreview = (src: string) => setPreviewSrc(src);
  const closePreview = () => setPreviewSrc(null);

  return (
    <>
      <Container ref={containerRef}>
        {messages.map((msg) => (
          <MessageWrapper key={msg.id} isUser={msg.sender === "user"}>
            {msg.type === "image" ? (
              <MessageBubble isUser={msg.sender === "user"}>
                <img
                  src={msg.content}
                  alt="챗봇 이미지"
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                  onClick={() => openPreview(msg.content)}
                />
              </MessageBubble>
            ) : (
              <MessageBubble isUser={msg.sender === "user"}>
                {msg.content}
              </MessageBubble>
            )}
          </MessageWrapper>
        ))}
      </Container>
      {previewSrc && (
        <ImagePreviewModal src={previewSrc} onClose={closePreview} />
      )}
    </>
  );
};

export default MessageList;
