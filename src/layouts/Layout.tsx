// Layout.tsx
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../assets/styles/theme";
import Header from "../components/Header/Header";

const HEADER_HEIGHT: string = theme.size.header_Height;

import ChatLauncher from "../components/Common/Chat/ChatLauncher";
import ChatWindow from "../components/Common/Chat/ChatWindow";
import { useState } from "react";
import { useChatSession } from "../hooks/useChatSession";

import { PAGE_PATHS } from "../constants/pagePaths";

const AppWrapper = styled.div`
  padding-top: ${HEADER_HEIGHT};
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 840px;
  }

  @media (min-width: 1024px) {
    max-width: 1140px;
  }

  @media (min-width: 1440px) {
    max-width: 1280px;
  }
`;

const LayoutContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const MainContent = styled.main`
  padding: 20px;
  min-height: calc(100vh - ${HEADER_HEIGHT});
  width: 100%;
`;

// 채팅 관련 포지션 고정
const ChatFixedWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
`;

// children 타입 지정
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // 챗봇이 보이는 경로 배열
  const chatVisiblePaths = [PAGE_PATHS.HOME, "/추후 결정하기"];
  const shouldShowChat = chatVisiblePaths.includes(currentPath);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, sendMessage } = useChatSession("ws://localhost:8080");

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <AppWrapper>
        <LayoutContainer>
          <MainContent>{children}</MainContent>
        </LayoutContainer>
      </AppWrapper>

      {shouldShowChat && (
        <ChatFixedWrapper>
          <ChatLauncher onClick={toggleChat} />
          <ChatWindow
            isOpen={isChatOpen}
            messages={messages}
            onSend={sendMessage}
            onClose={() => setIsChatOpen(false)}
          />
        </ChatFixedWrapper>
      )}
    </ThemeProvider>
  );
};

export default Layout;
