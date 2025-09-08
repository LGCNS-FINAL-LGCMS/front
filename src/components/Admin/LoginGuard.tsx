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

    const memberId = useSelector((state: RootState) => state.auth.memberId);

    useEffect(() => {
        if (!memberId) {
            alert("로그인시 이용가능합니다");
            navigate(PAGE_PATHS.LOGIN, { replace: true });
        }
    }, [memberId, navigate]);

    return memberId ? <>{children}</> : null;
};

export default LoginGuard;