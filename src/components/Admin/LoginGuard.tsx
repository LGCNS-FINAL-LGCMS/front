import { useEffect, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { PAGE_PATHS } from "../../constants/pagePaths";

interface LoginGuardProps {
  children: ReactNode;
}

const LoginGuard = ({ children }: LoginGuardProps) => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      alert("로그인시 이용가능합니다");
      navigate(PAGE_PATHS.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

export default LoginGuard;
