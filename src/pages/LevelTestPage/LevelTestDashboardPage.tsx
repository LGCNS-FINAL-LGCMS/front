import { useEffect, useState } from "react";
import styled from "styled-components";
import { getcategoriesList } from "../../api/Signup/signupAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { levelTestApi } from "../../utils/sessionStorage/levelTest";
import type { UserCategoriesList } from "../../types/authInfo";
import Button from "../../components/Common/Button";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import apiClient from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";
import Gold from "../../assets/images/levelTestPage/Gold.svg";
import Silver from "../../assets/images/levelTestPage/Silver.svg";
import Bronze from "../../assets/images/levelTestPage/Bronze.svg";
import SideTab from "../../components/Common/SideTab";

interface ReportList {
  reportId: number;
  totalScore: number;
  studentLevel: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
  category: string;
}

const Container = styled.div`
  font-family: ${(props) => props.theme.font.primary};
  max-width: ${(props) => props.theme.size.containerMax};
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const CategorySelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSize.title.max};
  color: ${(props) => props.theme.colors.text_D};
  border-bottom: 2px solid ${(props) => props.theme.colors.border_Dark};
  padding-bottom: 10px;
  text-align: left;
  width: fit-content;
`;

const CategorySelectSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: ${(props) => props.theme.shadow.md};
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CategoryTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.contents.medium};
  color: ${(props) => props.theme.colors.background_D};
  margin: 0;
`;

const CategorySection = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const CategoryDropdown = styled.select`
  font-size: ${(props) => props.theme.fontSize.body.min};
  padding: 12px 16px;
  border-radius: 20px;
  border: 2px solid ${(props) => props.theme.colors.gray_M};
  background-color: white;
  cursor: pointer;
  outline: none;
  transition: ${(props) => props.theme.transition.default};
  min-width: 200px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  margin: 0 20px;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 93, 159, 0.2);
  }
`;

const ReportListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%;
  margin: 0 auto;
`;

const TestReportTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSize.title.max};
  color: ${(props) => props.theme.colors.text_D};
  border-bottom: 2px solid ${(props) => props.theme.colors.border_Dark};
  padding-bottom: 10px;
  text-align: left;
  width: fit-content;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: ${(props) => props.theme.shadow.md};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: ${(props) => props.theme.transition.default};
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${(props) => props.theme.shadow.lg};
  }
`;

const ReportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReportTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.body.max};
  color: ${(props) => props.theme.colors.text_D};
  margin: 0;
`;

const ReportDate = styled.p`
  font-size: ${(props) => props.theme.fontSize.body.min};
  color: ${(props) => props.theme.colors.secondary};
  margin: 0;
`;

const ReportRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const StudentLevelIcon = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
`;

const ReportScore = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.colors.primary};
  margin: 0;
`;

const ReportCategory = styled.div``;

const EmptyListMessage = styled.p`
  text-align: center;
  padding: 30px;
  color: ${(props) => props.theme.colors.secondary};
  font-size: ${(props) => props.theme.fontSize.body.max};
  background: white;
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.shadow.sm};
  border: 1px solid ${(props) => props.theme.colors.border_Light};
`;

const LevelTestDashboardPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const [CategoryList, setCategoryList] = useState<UserCategoriesList[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [reportList, setReportList] = useState<ReportList[]>([]);

  const getCategory = async () => {
    try {
      const result = await getcategoriesList();
      if (result.status === "OK") setCategoryList(result.data.categories);
    } catch (error) {
      console.log("카테고리 API 호출 실패", error);
    }
  };

  const handleStartTest = async () => {
    if (selectedCategory === -1) {
      alert("카테고리를 선택해주세요");
      return;
    }
    try {
      const result = await levelTestApi(selectedCategory, auth.memberId);
      if (result) navigate(PAGE_PATHS.LEVEL_TEST.TEST);
    } catch (error) {
      console.log("레벨 테스트 API 호출 실패", error);
    }
  };

  // Report
  const getReportList = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STUDENT_REPORT.GET);
      if (response.data.status === "OK") {
        if (response.data.data) {
          setReportList(response.data.data);
        } else {
          console.log("레포트 데이터 없음");
        }
      } else {
        console.log("StudentReport API 연결 실패");
      }
    } catch (error) {
      console.log("StudentReport API 호출 실패", error);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "LOW":
        return Bronze;
      case "MEDIUM":
        return Silver;
      case "HIGH":
        return Gold;
      default:
        return Bronze;
    }
  };

  const handleReportClick = (reportId: number) => {
    navigate(`${PAGE_PATHS.USER_PAGE.STUDENT.REPORT}/${reportId}`);
  };

  useEffect(() => {
    getCategory();
    getReportList();
  }, []);

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
      <CategorySelectWrapper>
        <PageTitle>Level Test</PageTitle>
        <CategorySelectSection>
          <CategoryTitle>레벨 테스트할 카테고리를 선택해 주세요.</CategoryTitle>{" "}
          <CategorySection>
            <CategoryDropdown
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
            >
              <option value={-1} disabled hidden>
                카테고리를 선택하세요
              </option>
              {CategoryList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CategoryDropdown>
            <Button text="시험 시작" onClick={handleStartTest} />
          </CategorySection>
        </CategorySelectSection>
      </CategorySelectWrapper>
      <ReportListWrapper>
        <TestReportTitle>Report</TestReportTitle>
        {reportList.length > 0 ? (
          reportList.map((report) => (
            <ReportCard
              key={report.reportId}
              onClick={() => handleReportClick(report.reportId)}
            >
              <ReportInfo>
                <ReportTitle>테스트 레포트</ReportTitle>
                <ReportDate>
                  {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                </ReportDate>
              </ReportInfo>
              <ReportRight>
                <ReportScore>Score : {report.totalScore} / 100</ReportScore>
                <StudentLevelIcon
                  src={getLevelIcon(report.studentLevel)}
                  alt="Level Icon"
                />
                <ReportCategory>{report.category}</ReportCategory>
              </ReportRight>
            </ReportCard>
          ))
        ) : (
          <EmptyListMessage>
            아직 레벨테스트 결과가 없습니다. 위에서 테스트를 시작해보세요.
          </EmptyListMessage>
        )}
      </ReportListWrapper>
    </Container>
  );
};

export default LevelTestDashboardPage;
