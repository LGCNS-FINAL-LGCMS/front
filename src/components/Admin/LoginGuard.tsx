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
        // 없는게 아니라 -1이면 비로그인 상태다.
        if (memberId === -1) {
            alert("로그인시 이용가능합니다");
            navigate(PAGE_PATHS.LOGIN, { replace: true });
        }
    }, [memberId, navigate]);

    return memberId ? <>{children}</> : null;
};

export default LoginGuard;