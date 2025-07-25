import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Common/Button";
import SearchBar from "../components/Common/SearchBar";
import LectureCard from "../components/Common/LectureCard";

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
      <LectureCard
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSBwCciH8r1Ae27FRiVp4GmcH510aLHssTrw&s"
        title="Next.js 완벽 정복"
        description="Next.js와 React를 활용한 SSR 웹dddddddd "
        lecturer="홍길동"
        design={3}
        fontColor={2}
        width="250px"
        onClick={() => alert("강의 클릭됨!")}
      />
    </Container>
  );
};

export default MainPage;
