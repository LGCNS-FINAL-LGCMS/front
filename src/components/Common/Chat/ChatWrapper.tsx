// ChatWrapper.tsx
import { useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import styled from "styled-components";
import { PAGE_PATHS } from "../../../constants/pagePaths";
import ChatLauncher from "./ChatLauncher";
import ChatWindow from "./ChatWindow";
import { postGuides, type ResponseData } from "../../../api/Guide/guideAPI";
import type { ChatMessage } from "../../../types/message";
import { theme } from "../../../assets/styles/theme";


const ChatFixedWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: ${theme.zIndex.modal};
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
      type: "text",
    },
  ]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  function extractUrl(text: string): string | undefined {
    if (!text) return;
    const pattern = /(https?:\/\/[^\s\]]+)/g;
    const urls = text.match(pattern);
    if (!urls) return;
    return urls[0].trim();
  }

  // API를 호출하고 메시지 상태를 업데이트하는 함수
  const sendMessage = async (query: string) => {
    // 1. 사용자 메시지를 먼저 화면에 추가합니다.
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user', // 고유 ID 생성
      sender: "user",
      content: query,
      timestamp: new Date().getTime(),
      type: "text",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // 2. postGuides API를 호출합니다.
      const responseData: ResponseData = await postGuides(query);
      if (!responseData) {
        throw new Error("No valid data received from the API.");
      }
      const botMessages: ChatMessage[] = [];


      // 3. API 응답 데이터를 화면에 추가할 메시지 형태로 변환합니다.
      // image가 있을 경우 이미지 메시지도 추가합니다.
      const botChatMessages: ChatMessage = {
        id: Date.now().toString() + '-bot',
        sender: 'bot',
        content: responseData.answer,
        timestamp: new Date().getTime(),
        type: "text",
      }
      botMessages.push(botChatMessages);
      // 3-1. URL을 추출하고, URL이 있다면 UrlPortalCard 컴포넌트를 사용하여 메시지를 생성합니다.
      // TODO: 테스트중입니다.
      // const testdata = "네, 마이페이지의 회원정보수정에서 카테고리를 변경할 수 있습니다. 변경 후 저장하면 메인 추천이 순차적으로 반영됩니다.\n\n이 곳으로 이동하시면 원하시는 서비스를 이용할 수 있어요.\n[http://localhost:5173/home]\n\n궁금하신 점이 있다면 언제든지 질문해 주세요!";
      // const url = extractUrl(testdata);

      const url = extractUrl(responseData.answer);
      console.log("Extracted URL:", url);
      if (url) {
        const botUrlMessage: ChatMessage = {
          id: Date.now().toString() + '-bot-url',
          sender: 'bot',
          content: url,
          timestamp: new Date().getTime(),
          type: "url",
        };
        botMessages.push(botUrlMessage);
      }


      // 3-2. imageUrl
      if (responseData.imageUrl) {
        const botImageMessage: ChatMessage = {
          id: Date.now().toString() + '-bot-image',
          sender: 'bot',
          content: responseData.imageUrl,
          // content: "https://ko.react.dev/images/docs/react-devtools-standalone.png",
          timestamp: new Date().getTime(),
          type: "image",
        };
        botMessages.push(botImageMessage);
      }
      console.log("botMessages", botMessages);
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
        type: "text",
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
