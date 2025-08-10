import styled from "styled-components";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleLoginAPI } from "../../api/Login/loginAPI";

import { login } from "../../redux/token/tokenSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";

interface GoogleUserInfo {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

const GoogleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const GoogleLoginBox = () => {
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || "";
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

  const handleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        console.log("구글 로그인 실패"); // 구글 로그인 안됨
        alert("구글 로그인 정보가 없습니다. ");
        return;
      } else {
        const userInfo = jwtDecode<GoogleUserInfo>(
          credentialResponse.credential
        );
        console.log("로그인 시도 : ", userInfo.email);
      }

      const response = await googleLoginAPI(credentialResponse?.credential);

      console.log("백엔드 응답 받음 : ", response);

      if (response.status === "OK" && response.data?.tokens) {
        console.log("서버 연결 됨(토큰 받는 중)");
        const { accessToken, refreshToken } = response.data.tokens;
        const { alreadyMember } = response.data;
        dispatch(
          login({
            accessToken,
            refreshToken,
          })
        );
        console.log("로그인/토큰 스토리지 저장됨");

        // 서버연결 성공 시 Nav로 이동시키기 (모달창 띄워서 확인하면 이동시켜야됨)
        if (alreadyMember) {
          console.log("기존 회원임 ! 메인페이지로 이동");
          navigate("/home", { replace: true });
        } else {
          console.log("신규회원");
          navigate("/signup", { replace: true });
        }
      } else {
        console.log("서버연결 못함...");
        throw new Error(
          response?.message || "서버에서 토큰을 받지 못했습니다."
        );
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
