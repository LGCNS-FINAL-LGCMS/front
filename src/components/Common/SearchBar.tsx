// SearchBar.tsx
import React, {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: (value: string) => void;
  disabled?: boolean;
  design?: 1 | 2 | 3;
  fontColor?: 1 | 2;
  fontWeight?: 100 | 400 | 700;
  width?: string;
  placeholder?: string;
}

const designStyles = {
  1: css`
    background-color: #fff;
    border: 1px solid #dfe1e5;
    border-radius: 24px;
  `,
  2: css`
    background-color: ${({ theme }) => theme.colors.header};
    // border: 3px solid ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 1px 7px rgba(0, 0, 0, 1);
    border-radius: 12px;
  `,
  3: css`
    background-color: rgba(0, 0, 0, 0.05);
    border: none;
    border-radius: 8px;
  `,
};

const fontColors = {
  1: css`
    color: ${({ theme }) => theme.colors.text_B};
  `,
  2: css`
    color: ${({ theme }) => theme.colors.text_D};
  `,
};

const SearchContainer = styled.div<{
  design: 1 | 2 | 3;
  width?: string;
}>`
  display: flex;
  align-items: center;
  position: relative;
  width: ${({ width }) => width || "100%"};
  max-width: 584px;
  margin: 0 auto;
  height: 44px;
  box-shadow: none;

  ${({ design }) => designStyles[design]}

  &:hover,
  &:focus-within {
    border-color: rgba(223, 225, 229, 0);
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  }
`;

const StyledInput = styled.input<{
  fontColor?: 1 | 2;
  fontWeight: 100 | 400 | 700;
}>`
  flex-grow: 1;
  height: 100%;
  padding: 0 20px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  outline: none;
  border-radius: 24px;
  padding-right: 50px;
  font-weight: ${({ fontWeight }) => fontWeight};

  ${({ fontColor }) => fontColor && fontColors[fontColor]}
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  border-radius: 0 24px 24px 0;
  color: #70757a;

  &:hover {
    color: #333;
  }
`;

/**
 * 공통 버튼 컴포넌트입니다. *
 * @param value 입력될 값 (필수!!)
 * @param onChange 입력값 변경시 이벤트 (필수!!)
 * @param onSearch 검색시 이벤트 (필수!!)
 * @param disabled 비활성화 여부
 * @param design 스타일 디자인 번호(1,2,3)
 * @param fontColor 버튼 폰트 색상(1,2)
 * @param fontWeight 글꼴 두께(100,400,700)
 * @param width 너비 ex) width="300px"
 * @param placeholder 플레이스 홀더
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  disabled = false,
  design = 1,
  fontColor,
  fontWeight = 400,
  width,
  placeholder = "검색값을 입력하세요",
}) => {
  const handleSearch = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <SearchContainer design={design} width={width}>
      <StyledInput
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        fontColor={fontColor}
        fontWeight={fontWeight}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        aria-label="검색"
      />
      <SearchButton onClick={handleSearch} aria-label="검색 실행">
        <FontAwesomeIcon icon={faSearch} />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchBar;
