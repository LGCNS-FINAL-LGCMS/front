import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { useEffect, type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({
  children,
  requiredRole = "ADMIN",
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user || user.role !== requiredRole) {
      navigate(PAGE_PATHS.HOME, { replace: true });
    }
  }, [user, requiredRole, navigate]);

  if (user && user.role === requiredRole) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
