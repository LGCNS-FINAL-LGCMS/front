// Button.tsx
import React from "react";
import styled, { css } from "styled-components";

interface ButtonProps {
  text: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  design?: 1 | 2 | 3 | 4;
  fontColor?: 1 | 2;
  fontWeight?: 100 | 400 | 700;
  title?: string;
}

const buttonStyles = {
  1: css`
    background-color: ${({ theme }) => theme.colors.header};
    color: ${({ theme }) => theme.colors.text_B};
    border-radius: 3px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  `,
  2: css`
    background-color: transparent;
    border-radius: 15px;
    color: ${({ theme }) => theme.colors.header};
    border: 3px solid ${({ theme }) => theme.colors.header};

    &:hover {
      background-color: ${({ theme }) => theme.colors.header};
      color: ${({ theme }) => theme.colors.text_B};
    }
  `,
  3: css`
    background-color: rgba(0, 0, 0, 0.25);
    color: ${({ theme }) => theme.colors.text_B};
    border-radius: 25px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.45);
    }
  `,
  4: css`
    background-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.text_B};
    border-radius: 6px;

    &:hover {
      background-color: #c62828;
    }
  `,
};

const buttonFontColors = {
  1: css`
    color: ${({ theme }) => theme.colors.text_B};
  `,
  2: css`
    color: ${({ theme }) => theme.colors.text_D};
  `,
};

const StyledButton = styled.button<{
  design: 1 | 2 | 3 | 4;
  fontColor?: 1 | 2;
  fontWeight: 100 | 400 | 700;
}>`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  font-weight: ${({ fontWeight }) => fontWeight};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  ${({ design }) => buttonStyles[design]}

  ${({ fontColor }) => fontColor && buttonFontColors[fontColor]}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disable};
    color: #666;
    cursor: not-allowed;
    border: none;
  }
`;

/**
 * 공통 버튼 컴포넌트입니다. *
 * @param text 버튼에 표시될 텍스트 (필수!!)
 * @param onClick 클릭 시 실행될 핸들러 (필수!!)
 * @param type HTML 버튼 타입
 * @param disabled 비활성화 여부
 * @param design 스타일 디자인 번호(1,2,3)
 * @param fontColor 버튼 폰트 색상(1,2)
 * @param fontWeight 글꼴 두께(100,400,700)
 * @param title 마우스오버 툴팁
 */
const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  design = 1,
  fontColor,
  fontWeight = 400,
  title,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      type={type}
      disabled={disabled}
      design={design}
      fontColor={fontColor}
      fontWeight={fontWeight}
      title={title}
    >
      {text}
    </StyledButton>
  );
};

export default Button;
