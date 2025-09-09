import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { PAGE_PATHS } from "../../constants/pagePaths";

const roleHierarchy: Record<string, number> = {
  GUEST: 0,
  STUDENT: 1,
  LECTURER: 2,
  ADMIN: 3,
};

interface RoleGuardProps {
  minRole: string;
  children: React.ReactNode;
}

const RoleGuard = ({ minRole, children }: RoleGuardProps) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );
  const role = useSelector((state: RootState) => state.auth.role);

  const userRole = isAuthenticated ? role : "GUEST";

  useEffect(() => {
    if (
      userRole !== "ADMIN" &&
      roleHierarchy[userRole] < roleHierarchy[minRole]
    ) {
      navigate(PAGE_PATHS.LOGIN, { replace: true });
    }
  }, [userRole, minRole, navigate]);

  if (userRole !== "ADMIN" && roleHierarchy[userRole] < roleHierarchy[minRole])
    return null;

  return <>{children}</>;
};

export default RoleGuard;
