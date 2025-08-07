import GoogleLoginBox from "./GoogleLoginBox";

import styled from "styled-components";

const LoginBoxContainer = styled.div`
  display: contents;
  flex-direction: column;
  width: 600px;
  height: 90dvh;
`;

const LoginCard = styled.div`
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 60px 80px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 400px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin: 0 0 30px 0;
  letter-spacing: 2px;
`;

const Subtitle = styled.h3``;

const LoginBox = () => {
  return (
    <LoginBoxContainer>
      <LoginCard>
        <Title>LG CMS</Title>
        <Subtitle>가입 후 원하는 스택을 키워보세요 ! </Subtitle>
        <GoogleLoginBox />
      </LoginCard>
    </LoginBoxContainer>
  );
};

export default LoginBox;
