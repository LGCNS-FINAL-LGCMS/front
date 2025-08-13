// ChatWrapper.tsx
import { useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import styled from "styled-components";
import { PAGE_PATHS } from "../../../constants/pagePaths";
import ChatLauncher from "./ChatLauncher";
import ChatWindow from "./ChatWindow";
import { postGuides } from "../../../api/Guide/guideAPI";
import type { ChatMessage } from "../../../types/message";


const ChatFixedWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
`;


const ChatWrapper = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const chatVisiblePaths = [
    `${PAGE_PATHS.HOME}/:keyword?/:category?`,
    "/추후 결정하기",
  ];

  const shouldShowChat = chatVisiblePaths.some((path) =>
    matchPath({ path, end: false }, currentPath)
  );

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "안녕하세요! 무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date().getTime(),
    },
  ]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // API를 호출하고 메시지 상태를 업데이트하는 함수
  const sendMessage = async (query: string) => {
    // 1. 사용자 메시지를 먼저 화면에 추가합니다.
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user', // 고유 ID 생성
      sender: 'user',
      content: query,
      timestamp: new Date().getTime(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // 2. postGuides API를 호출합니다.
      const responseData = await postGuides(query);

      // 3. API 응답 데이터를 화면에 추가할 메시지 형태로 변환합니다.
      const botMessages: ChatMessage[] = responseData.map((data, index) => ({
        id: Date.now().toString() + '-bot-' + index, // 고유 ID 생성
        sender: 'bot',
        content: data.answer,
        timestamp: new Date().getTime(),
      }));
      // 4. 기존 메시지 목록에 봇의 답변을 추가합니다.
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);

    } catch (error) {
      console.error("Error sending message:", error);

      // 5. 에러 메시지를 사용자에게 보여줍니다.
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: 'bot',
        content: "죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다.",
        timestamp: new Date().getTime(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  if (!shouldShowChat) return null;

  return (
    <ChatFixedWrapper>
      <ChatLauncher onClick={toggleChat} />
      <ChatWindow
        isOpen={isChatOpen}
        messages={messages}
        onSend={sendMessage}
        onClose={() => setIsChatOpen(false)}
      />
    </ChatFixedWrapper>
  );
};

export default ChatWrapper;
