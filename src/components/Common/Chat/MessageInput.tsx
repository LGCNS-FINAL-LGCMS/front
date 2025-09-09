import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faStop } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  setSending,
  setSuccess,
  setError,
  setIdle,
} from "../../../redux/GuideBot/guideBotSlice";

interface MessageInputProps {
  onSend: (message: string) => void;
  initialSuggestions?: string[];
  showInitialSuggestions?: boolean;
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

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const SendButton = styled.button`
  margin-left: 8px;
  padding: 8px 12px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary} 0%,
    ${({ theme }) => theme.colors.primary} 100%
  );
  color: ${({ theme }) => theme.colors.text_B};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    filter: brightness(1.03);
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
    box-shadow: none;
  }
`;

// 검색어 버블 컨테이너
const SuggestionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  /* 위치를 입력창 위에 고정 */
  position: absolute;
  bottom: 60px; /* 입력창 높이와 간격을 고려해 조절 */
  left: 10px;
  right: 10px;

  margin-bottom: 10px;
  /* 오른쪽 정렬 */
  justify-content: flex-end;
`;

// 검색어 칩
const SuggestionChip = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background_Overlay};
  color: ${({ theme }) => theme.colors.text_B};
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray_M};
  }
`;

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  initialSuggestions = [],
  showInitialSuggestions = true,
}) => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  // 최초 'idle' 상태
  const status = useSelector((state: RootState) => state.guide.status);
  const [showSuggestions, setShowSuggestions] = useState(
    showInitialSuggestions
  );

  const handleSend = async (message: string) => {
    if (message.trim()) {
      // 메시지 전송 중
      dispatch(setSending());
      setShowSuggestions(false);

      try {
        // 메시지 전송
        setInput("");
        await onSend(message.trim());

        dispatch(setSuccess());
      } catch {
        // console.error("전송버튼 중 오류 발생:", error);

        dispatch(setError());
      } finally {
        // 메시지 전송 완료
        dispatch(setIdle());
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (status === "sending") return; // 전송 중에는 클릭 무시
    handleSend(suggestion);
  };

  return (
    <Container>
      {showSuggestions &&
        initialSuggestions &&
        initialSuggestions.length > 0 && (
          <SuggestionContainer>
            {initialSuggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </SuggestionChip>
            ))}
          </SuggestionContainer>
        )}
      <InputGroup>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (status === "sending") {
              e.preventDefault();
            } else if (e.key === "Enter") {
              handleSend(input);
            }
          }}
          placeholder="메시지를 입력하세요"
          aria-label="메시지 입력"
        />
        <SendButton
          onClick={() => handleSend(input)}
          aria-label="메시지 전송"
          disabled={status === "sending" || !input.trim()}
        >
          <FontAwesomeIcon
            icon={status === "sending" ? faStop : faPaperPlane}
          />
        </SendButton>
      </InputGroup>
    </Container>
  );
};

export default MessageInput;
