import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { setSending, setSuccess, setError, setIdle } from "../../../redux/GuideBot/guideBotSlice";


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
  margin-left: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary} 0%, ${({ theme }) => theme.colors.primary} 100%);
  color: ${({ theme }) => theme.colors.text_B};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover { filter: brightness(1.03); }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: default; box-shadow: none; }
`;

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  // 최초 'idle' 상태
  const status = useSelector((state: RootState) => state.guide.status);

  const handleSend = async () => {
    if (input.trim()) {
      // 메시지 전송 중
      dispatch(setSending());

      try {
        // 메시지 전송
        setInput("");
        await onSend(input.trim());

        dispatch(setSuccess());
      } catch (error) {
        console.error("전송버튼 중 오류 발생:", error);

        dispatch(setError());
      } finally {
        // 메시지 전송 완료
        dispatch(setIdle());
      }
    }
  };

  return (
    <Container>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (status === "sending") {
            e.preventDefault();
          } else {
            e.key === "Enter" && handleSend()
          }
        }}
        placeholder="메시지를 입력하세요"
        aria-label="메시지 입력"
      />
      <SendButton onClick={handleSend} aria-label="메시지 전송" disabled={status === "sending" || !input.trim()}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </SendButton>
    </Container>
  );
};

export default MessageInput;
