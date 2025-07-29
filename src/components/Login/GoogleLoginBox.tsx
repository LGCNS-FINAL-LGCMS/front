import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";

const GoogleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  & > * {
    margin: 0 auto;
  }
`;

const GoogleLoginBox = () => {
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || "";

  const handleLogin = (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) return;

      const userInfo = jwtDecode(credentialResponse.credential);

      console.log("로그인 성공", userInfo);
    } catch (error) {
      console.log("로그인 처리 실패", error);
    }
  };
  const handleLoginError = () => {
    console.log("로그인 실패");
    alert("로그인에 실패하였습니다.");
  };

  return (
    <div>
      <GoogleButtonWrapper>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={handleLogin}
            onError={handleLoginError}
            type="icon"
            shape="circle"
            size="large"
          />
        </GoogleOAuthProvider>
      </GoogleButtonWrapper>
    </div>
  );
};

export default GoogleLoginBox;
