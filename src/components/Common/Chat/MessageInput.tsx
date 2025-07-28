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

const SendButton = styled.button`
  margin-left: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.header};
  color: ${({ theme }) => theme.colors.text_B};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    opacity: 0.85;
  }
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
