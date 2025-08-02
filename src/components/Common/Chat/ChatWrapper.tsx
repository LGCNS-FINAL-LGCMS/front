// ChatWrapper.tsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { PAGE_PATHS } from "../../../constants/pagePaths";
import ChatLauncher from "./ChatLauncher";
import ChatWindow from "./ChatWindow";
import { useChatSession } from "../../../hooks/useChatSession";

const ChatFixedWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
`;

const ChatWrapper = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const chatVisiblePaths = [PAGE_PATHS.HOME, "/추후 결정하기"];
  const shouldShowChat = chatVisiblePaths.includes(currentPath);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, sendMessage } = useChatSession("ws://localhost:8080");

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
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
