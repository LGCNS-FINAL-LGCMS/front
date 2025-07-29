import {
  LoginBoxContainer,
  LoginCard,
  Title,
  Subtitle,
} from "./LoginBox.styled";
import GoogleLoginBox from "./GoogleLoginBox";

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
