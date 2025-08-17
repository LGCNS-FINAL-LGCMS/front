import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import type { ChatMessage } from "../../../types/message";
import { ImagePreviewModal } from "./ImagePreviewModal";
import UrlPortalCard from "./UrlPortalCard";

import { useSelector } from 'react-redux';
import type { RootState } from "../../../redux/store";

interface MessageListProps {
  messages: ChatMessage[];
}

const Container = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.background_Overlay};
    border-radius: 4px;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray_M};
    }
  }
`;


export const MessageWrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  padding: 0 8px;
  margin: 10px 0;
`;

export const MessageBubble = styled.div<{ isUser: boolean; isImage: boolean }>`
  position: relative;
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 16px;
  line-height: 1.48;
  font-size: 14px;
  word-break: break-word;
  box-shadow: 0 6px 18px ${({ theme }) => theme.shadow.sm};
  animation: pop 180ms cubic-bezier(.2, .8, .2, 1);

  /* 역할별 바탕 */
  color: ${({ isUser, theme }) => (isUser ? theme.colors.text_B : theme.colors.text_D)};
  background: ${({ isUser, theme }) =>
    isUser
      ? `linear-gradient(135deg, ${theme.colors.background_D} 0%, ${theme.colors.primary} 100%)`
      : theme.colors.background_B
  };
  
  left: ${({ isUser }) => (isUser ? 'auto' : '-11px')};
  right: ${({ isUser }) => (isUser ? '-11px' : 'auto')};

  @keyframes pop {
    0 % {
      transform: scale(0.9);
      opacity: 0;
    }
    100 % {
      transform: scale(1);
      opacity: 1;
    }
  }
  transition: background - color 0.16s ease, transform 0.06s ease;
  
  cursor: ${({ isImage }) => (isImage ? 'pointer' : 'default')};
  &:hover {
     ${({ isImage }) => isImage && 'transform: scale(1.02);'}
  }
  font-famliy: ${({ theme }) => theme.font.primary}, sans-serif;
  `;

const Dot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 4px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0.6;
  animation: blink 1s infinite;

  &:nth-child(2) {
    animation-delay: 0.15s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes blink {
    0% {
      opacity: 0.2;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-2px);
    }
    60% {
      opacity: 0.4;
      transform: translateY(0);
    }
    100% {
      opacity: 0.2;
      transform: translateY(0);
    }
  }
`;

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const status = useSelector((state: RootState) => state.guide.status);


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
              <MessageBubble isUser={msg.sender === "user"} isImage={true}>
                <img
                  src={msg.content}
                  alt="챗봇 이미지"
                  // TODO : 고정이미지로 하기
                  style={{ maxWidth: '256px', maxHeight: '186px', borderRadius: '8px' }}
                  onClick={() => openPreview(msg.content)}
                />
              </MessageBubble>
            ) : msg.type === "url" ? (
              <UrlPortalCard
                description="링크를 클릭하여 자세히 알아보세요."
                url={msg.content}
              />
            ) : (
              <MessageBubble isUser={msg.sender === "user"} isImage={false}>
                {msg.content}
              </MessageBubble>
            )}
          </MessageWrapper>
        ))}

        {status === 'sending' && (
          <MessageWrapper isUser={false}>
            <MessageBubble isUser={false} aria-label="답변 작성 중" isImage={false}>
              <Dot /><Dot /><Dot />
            </MessageBubble>
          </MessageWrapper>
        )}

      </Container>
      {previewSrc && (
        <ImagePreviewModal src={previewSrc} onClose={closePreview} />
      )}
    </>
  );
};

export default MessageList;
