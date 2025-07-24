import React from "react";
import styled from "styled-components";
import Button from "../components/Common/Button";

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
  const handleClick = () => {
    alert("버튼이 클릭됐어요!");
  };

  return (
    <Container>
      <Title>
        안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요
        안녕하세요 안녕하세요안녕하세요안녕하세요 안녕하세요안녕하세요
        안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요
        안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요안녕하세요
        안녕하세요 안녕하세요 안녕하세요안녕하세요 안녕하세요 안녕하세요
        안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요
        안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요
        안녕하세요 안녕하세요 안녕하세요 안녕하세요안녕하세요 안녕하세요
        안녕하세요 안녕하세요 안녕하세요 안녕하세요 안녕하세요
      </Title>

      <Button
        text="클릭"
        onClick={handleClick}
        design={3}
        fontWeight={700}
        disabled={false}
      />
    </Container>
  );
};

export default MainPage;
