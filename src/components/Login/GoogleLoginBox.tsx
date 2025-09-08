import styled from "styled-components";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleLoginAPI } from "../../api/Login/loginAPI";
import { PAGE_PATHS } from "../../constants/pagePaths";

import { setUserInfo } from "../../redux/Auth/authSlice";
import { login } from "../../redux/token/tokenSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";

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

  const handleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        alert("구글 로그인 정보가 없습니다.");
        return;
      }

      const response = await googleLoginAPI(credentialResponse?.credential);

      if (response.status === "OK" && response.data?.tokens) {
        const { accessToken, refreshToken } = response.data.tokens;

        dispatch(
          login({
            accessToken,
            refreshToken,
          })
        );

        // 서버연결 성공 시 Nav로 이동시키기 (모달창 띄워서 확인하면 이동시켜야됨)
        const { memberInfo } = response.data;
        const { alreadyMember } = response.data;
        if (alreadyMember && memberInfo) {
          dispatch(setUserInfo(memberInfo));
          navigate(PAGE_PATHS.HOME, { replace: true });
        } else {
          navigate(PAGE_PATHS.SIGNUP, { replace: true });
        }
      } else {
        throw new Error(
          response?.message || "서버에서 토큰을 받지 못했습니다."
        );
      }
    } catch {
      return null;
    }
  };

  const handleLoginError = () => {
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
