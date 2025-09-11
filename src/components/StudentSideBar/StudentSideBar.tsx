import { matchPath, useLocation, useNavigate } from "react-router-dom";
import SideTab from "../Common/SideTab";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { useState } from "react";

const StudentSideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [id, setId] = useState<number>(0);

  // 사이드바가 보여질 경로 배열
  const visiblePaths = [
    PAGE_PATHS.USER_PAGE.STUDENT.MY_LECTURES,
    PAGE_PATHS.LEVEL_TEST.DASHBOARD,
    PAGE_PATHS.USER_PAGE.STUDENT.USER_INFO,
    PAGE_PATHS.USER_PAGE.STUDENT.QNA,
  ];

  const shouldShowSidebar = visiblePaths.some((path) =>
    matchPath({ path, end: false }, currentPath)
  );

  if (!shouldShowSidebar) return null;

  return (
    <SideTab
      title="마이페이지"
      currentItemId={id}
      items={[
        { id: 0, label: "나의 강좌" },
        { id: 1, label: "레벨 테스트" },
        { id: 2, label: "회원 정보 수정" },
        { id: 3, label: "나의 Q&A" },
      ]}
      onSelect={(id) => {
        const path = visiblePaths[id];
        setId(id);
        if (path) navigate(path);
      }}
    />
  );
};

export default StudentSideBar;
