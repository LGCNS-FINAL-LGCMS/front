import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface MessageInputProps {
  onSend: (message: string) => void;
}

const Container = styled.div`
  padding: 10px;
  border-top: 1px solid #ddd;
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-weight: 400;
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.primary};
`;

export const SendButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #5b86e5 0%, #36d1dc 100%);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.12s ease, transform 0.06s ease;
  box-shadow: 0 8px 18px rgba(91, 134, 229, 0.28);

  &:hover { filter: brightness(1.03); }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: default; box-shadow: none; }
`;

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <Container>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="메시지를 입력하세요"
        aria-label="메시지 입력"
      />
      <SendButton onClick={handleSend} aria-label="메시지 전송">
        <FontAwesomeIcon icon={faPaperPlane} />
      </SendButton>
    </Container>
  );
};

export default MessageInput;
