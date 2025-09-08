import { useLocation, matchPath, useNavigate } from "react-router-dom";
import SideTab from "../Common/SideTab";
import { PAGE_PATHS } from "../../constants/pagePaths";

const LecturerSideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // 사이드바가 보여질 경로 배열
  const visiblePaths = [
    PAGE_PATHS.USER_PAGE.LECTURER.MAIN,
    PAGE_PATHS.USER_PAGE.LECTURER.DASHBOARD,
    PAGE_PATHS.USER_PAGE.LECTURER.REPORT,
  ];

  const shouldShowSidebar = visiblePaths.some((path) =>
    matchPath({ path, end: false }, currentPath)
  );

  if (!shouldShowSidebar) return null;

  return (
    <SideTab
      title="강사 페이지"
      items={[
        { id: 0, label: "강의 컨텐츠" },
        { id: 1, label: "대시보드" },
        { id: 2, label: "레포트" },
      ]}
      onSelect={(id) => {
        const path = visiblePaths[id];
        if (path) navigate(path);
      }}
    />
  );
};

export default LecturerSideBar;
