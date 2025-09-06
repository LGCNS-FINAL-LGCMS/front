import GoogleLoginBox from "../../components/Login/GoogleLoginBox";
import styled from "styled-components";

const LoginBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 20px;
`;

const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;

  background: white;
  border-radius: 16px;
  text-align: center;
  min-width: ${(props) => props.theme.size.container_S};
  max-width: 90vw;
  min-height: 400px;
  padding: 40px;
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.font.logo};
  font-size: ${(props) => props.theme.fontSize.display.min};
  color: ${(props) => props.theme.colors.border_Dark};
  letter-spacing: 2px;
  margin: 0;
`;

const Subtitle = styled.h3`
  font-family: ${(props) => props.theme.font.primary};
  white-space: nowrap;
  margin: 0;
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
