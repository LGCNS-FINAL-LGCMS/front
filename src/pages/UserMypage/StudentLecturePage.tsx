import styled from "styled-components";

import StudentLectureContainer from "../../components/StudentLecture/StudentLectureContainer";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import SideTab from "../../components/Common/SideTab";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height});
  font-family: ${(props) => props.theme.font.primary};
`;

const MypageTitle = styled.h1`
  width: ${(props) => props.theme.size.bottomLine};
  font-size: ${({ theme }) => theme.fontSize.title.max};
  color: ${({ theme }) => theme.colors.text_D};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border_Dark};
  padding: 10px 0;
`;

const StudentLecturePage = () => {
  const navigate = useNavigate();

  //sideTab
  const tabItems = [
    {
      id: 1,
      label: "나의 강의실",
      action: () => navigate(PAGE_PATHS.USER_PAGE.STUDENT.MY_LECTURES),
    },
    {
      id: 2,
      label: "Level Test",
      action: () => navigate(PAGE_PATHS.LEVEL_TEST.DASHBOARD),
    },
    {
      id: 3,
      label: "회원정보수정",
      action: () => navigate(PAGE_PATHS.USER_PAGE.STUDENT.USER_INFO),
    },
    {
      id: 4,
      label: "나의 Q&A",
      action: () => navigate(PAGE_PATHS.USER_PAGE.STUDENT.QNA),
    },
  ];

  const handleTabSelect = (id: number) => {
    const tab = tabItems.find((t) => t.id === id);
    if (tab?.action) tab.action();
  };

  return (
    <Container>
      <SideTab title="My Page" items={tabItems} onSelect={handleTabSelect} />
      <MypageTitle>나의 강의실</MypageTitle>
      <StudentLectureContainer />
    </Container>
  );
};

export default StudentLecturePage;
