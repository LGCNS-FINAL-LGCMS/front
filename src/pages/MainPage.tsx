import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Common/Button";
import SearchBar from "../components/Common/SearchBar";

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.caution};
  font-family: ${({ theme }) => theme.font.primary};
  font-weight: 600;
  line-height: 1.5;
  word-break: keep-all;
`;

const Container = styled.div`
  padding: 2rem;
`;

const MainPage = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleClick = () => {
    alert("버튼이 클릭됐어요!");
  };

  const handleSearch = (value: string) => {
    alert(`검색어: ${value}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <Container>
      <SearchBar
        value={searchValue}
        fontColor={1}
        fontWeight={100}
        design={2}
        width="450px"
        onChange={handleInputChange}
        onSearch={handleSearch}
        disabled={false}
        placeholder="하이요"
      />
    </Container>
  );
};

export default MainPage;
