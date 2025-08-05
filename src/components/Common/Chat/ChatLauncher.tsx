import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

interface ChatLauncherProps {
  onClick: () => void;
}

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.header};
  color: ${({ theme }) => theme.colors.text_B};
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.85;
  }
`;

const ChatLauncher: React.FC<ChatLauncherProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} aria-label="Open chat window">
      <FontAwesomeIcon icon={faCommentDots} />
    </Button>
  );
};

export default ChatLauncher;
