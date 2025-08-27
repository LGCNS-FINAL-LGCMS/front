import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS } from '../../constants/pagePaths';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredRole = 'ADMIN' }) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!user || user.role !== requiredRole) {
            navigate(PAGE_PATHS.HOME, { replace: true });
        }
    }, [user, requiredRole, navigate]);

    // 권한이 있으면 자식 렌더링
    if (user && user.role === requiredRole) {
        return children;
    }

    // 권한이 없으면 렌더링 x
    return null;
};

export default ProtectedRoute;