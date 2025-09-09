import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import { useEffect } from "react";
import { PAGE_PATHS } from "../../../constants/pagePaths";

interface SignupGuardProps {
  children: React.ReactNode;
}

const SignupGuard: React.FC<SignupGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const isUsedMemberId = useSelector((state: RootState) => state.auth.memberId);

  useEffect(() => {
    if (isUsedMemberId !== -1) {
      navigate(PAGE_PATHS.HOME, { replace: true });
    }
  }, [isUsedMemberId, navigate]);

  return <>{children}</>;
};

export default SignupGuard;
