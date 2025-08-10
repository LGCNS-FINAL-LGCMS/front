import GoogleLoginBox from "../../components/Login/GoogleLoginBox";
import styled from "styled-components";

const LoginBoxContainer = styled.div`
  display: flex;
  justify-content: center; // 가로 중앙 정렬
  align-items: center; //세로 중앙 정렬
  min-height: 80vh;
`;

const LoginCard = styled.div`
  background: white;
  border: 2px solid ${(props) => props.theme.colors.border_Dark};
  border-radius: 16px;
  padding: 20px 60px;
  text-align: center;

  width: 600px;
  height: 400px;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.font.logo};
  padding: 30px 60px;

  font-size: 48px;
  font-weight: bold;
  color: #333;
  letter-spacing: 2px;
`;

const Subtitle = styled.h3`
  padding: 20px 60px;

  font-family: ${(props) => props.theme.font.primary};
`;

const Login = () => {
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

export default Login;
