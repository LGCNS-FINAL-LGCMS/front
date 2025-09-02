import styled from "styled-components";

import StudnetLectureContainer from "../../components/StudentLecture/StudentLectureContainer";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import SideTab from "../../components/Common/SideTab";

const Container = styled.div``;

const StudentLectureContainer = styled.div``;

const MypageTitle = styled.p`
  border-bottom: 2px solid;
  width: 1080px;
  font-size: ${(props) => props.theme.fontSize.title.max};
  font-family: ${(props) => props.theme.font.primary};
  border-color: ${(props) => props.theme.colors.border_Dark};
  margin: 0 auto 30px auto; /* 👈 좌우 auto로 가운데 정렬! */
`;

const StudentLecturePage = () => {
  const navigate = useNavigate();

  //sideTab
  const tabItems = [
    {
      id: 1,
      label: "My Lecture",
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
      <SideTab title="MyPage" items={tabItems} onSelect={handleTabSelect} />
      <StudentLectureContainer>
        <MypageTitle>MY PAGE</MypageTitle>
        <StudnetLectureContainer />
      </StudentLectureContainer>
    </Container>
  );
};

export default StudentLecturePage;
