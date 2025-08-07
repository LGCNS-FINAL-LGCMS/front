import GoogleLoginBox from "./GoogleLoginBox";

import styled from "styled-components";

const LoginBoxContainer = styled.div`
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  min-height: 80vh;
`;

const LoginCard = styled.div`
  background: white;
  border: 2px solid ${(props) => props.theme.colors.border_Dark}; /* 테마 색상 사용 */
  border-radius: 16px;
  padding: 80px 60px;
  text-align: center;

  width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.font.logo};

  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin: 0 0 30px 0;
  letter-spacing: 2px;
`;

const Subtitle = styled.h3`
  font-family: ${(props) => props.theme.font.primary};
`;

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
