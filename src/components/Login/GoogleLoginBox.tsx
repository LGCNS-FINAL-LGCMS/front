import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import { googleLoginAPI } from "../../api/Login/loginAPI";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { login } from "../../redux/token/tokenSlice";

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
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        console.log("구글 토큰이 없어요");
        alert("구글 로그인 정보가 없습니다. ");
        return;
      }
      const userInfo = jwtDecode(credentialResponse.credential);
      console.log("로그인 성공,, 사용자 정보 : ", userInfo);

      const response = await googleLoginAPI(credentialResponse.credential);

      if (response.status === "OK" && response.data?.tokens) {
        const { accessToken, refreshToken } = response.data.tokens;
        dispatch(
          login({
            accessToken,
            refreshToken,
          })
        );
        console.log("로그인/토큰 저장 완료 ! ");
      }
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
