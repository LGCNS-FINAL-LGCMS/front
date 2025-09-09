// ChatWrapper.tsx
import { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import styled from "styled-components";
import { PAGE_PATHS } from "../../../constants/pagePaths";
import ChatLauncher from "./ChatLauncher";
import ChatWindow from "./ChatWindow";
import { getRecommendQuestions, postGuides, type recommendResponse, type ResponseData } from "../../../api/Guide/guideAPI";
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
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>();

  // 3개의 추천질문 불러오기
  useEffect(() => {
    const fetchRecommendations = async () => {
      const initialSuggestions: recommendResponse = await getRecommendQuestions();
      // string[]으로 변환
      const questions = initialSuggestions.exampleQuestion;
      setRecommendedQuestions(questions);
    };
    fetchRecommendations();
  }, []);


  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  type ParsedText = {
    text: string;
    url?: string;
  };

  function parseTextUrl(inputText: string): ParsedText | undefined {
    if (!inputText) return;
    const pattern = /\[(https?:\/\/[^\s\]]+)\]/;
    const match = inputText.match(pattern);
    if (match && match[1]) {
      const allmatches = match[0];
      const url = match[1];
      // 원본에서 url 제거
      const text = inputText.replace(allmatches, '').trim();

      return { text: text, url: url };
    } else {
      return { text: inputText, url: undefined };
    }
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
      const parsedResponse = parseTextUrl(responseData.answer);
      const botChatMessages: ChatMessage = {
        id: Date.now().toString() + '-bot',
        sender: 'bot',
        content: parsedResponse ? parsedResponse.text : responseData.answer,
        timestamp: new Date().getTime(),
        type: "text",
      }
      botMessages.push(botChatMessages);

      if (parsedResponse) {
        const botUrlMessage: ChatMessage = {
          id: Date.now().toString() + '-bot-url',
          sender: 'bot',
          content: parsedResponse.url || "",
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
      // console.log("botMessages", botMessages);
      // 4. 기존 메시지 목록에 봇의 답변을 추가합니다.
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);

    } catch {
      // console.error("Error sending message:", error);

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
        initialSuggestions={recommendedQuestions}
      />
    </ChatFixedWrapper>
  );
};

export default ChatWrapper;
