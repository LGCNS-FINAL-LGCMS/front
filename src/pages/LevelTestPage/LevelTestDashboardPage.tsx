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

interface ReportList {
  reportId: number;
  totalScore: number;
  studentLevel: "HIGH" | "MEDIUM" | "LOW";
  createdAt: number[];
  category: string;
}

const Container = styled.div`
  font-family: ${(props) => props.theme.font.primary};
  max-width: ${(props) => props.theme.size.containerMax};
  margin: 20px auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const CategorySelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: ${(props) => props.theme.shadow.md};
  padding: 30px;
  min-width: 600px;
`;

const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSize.title.max};
  color: ${(props) => props.theme.colors.background_Overlay};
  border-bottom: 2px solid ${(props) => props.theme.colors.background_Overlay};
  text-align: left;
  width: fit-content;
  padding-bottom: 8px;
`;

const CategorySelectBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const CategoryTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.contents.medium};
  color: ${(props) => props.theme.colors.text_D};
  width: fit-content;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CategoryDropdown = styled.select`
  font-size: ${(props) => props.theme.fontSize.body.min};
  padding: 12px 30px;
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

const CategoryButton = styled.div``;

const ReportListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: ${(props) => props.theme.shadow.md};
  min-height: 80%;
  padding: 30px;
  min-width: 600px;
`;

const ReportTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSize.title.max};
  color: ${(props) => props.theme.colors.background_Overlay};
  border-bottom: 2px solid ${(props) => props.theme.colors.background_Overlay};
  padding-bottom: 8px;
  text-align: left;
  width: fit-content;
`;

const ReportContainer = styled.div`
  padding: 0 20px;
  margin: 20px 0;
`;

const ReportCard = styled.div`
  background: white;
  gap: 30px;
  padding: 18px 20px;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray_M};
  display: flex;
  align-items: center;

  transition: ${(props) => props.theme.transition.default};
  cursor: pointer;

  &:last-child {
    border-bottom: none; // 마지막 요소는 border 없애기
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${(props) => props.theme.shadow.sm};
    background-color: ${(props) => props.theme.colors.card};
  }
`;

const ReportInfo = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

const ReportNumber = styled.div`
  background-color: rgba(0, 93, 159, 0.1);
  color: ${(props) => props.theme.colors.primary};
  min-width: 28px;
  min-height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSize.body.min};
  font-weight: 600;
  margin: auto 0;
`;

const ReportDate = styled.p`
  font-size: ${(props) => props.theme.fontSize.body.min};
  color: ${(props) => props.theme.colors.secondary};
  white-space: nowrap;
  margin: 0 auto;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReportCategory = styled.div`
  background-color: rgba(0, 93, 159, 0.1);
  height: 35px;
  padding: 2px 8px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 100px;
`;

const StudentLevelIcon = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin: 0 auto;
  width: 50%;
`;

const ReportScore = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.colors.primary};
  white-space: nowrap;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const EmptyListMessage = styled.p`
  text-align: center;
  margin: 0;
  padding: 20px;
  color: ${(props) => props.theme.colors.secondary};
  font-size: ${(props) => props.theme.fontSize.body.max};
`;

const LevelTestDashboardPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const [CategoryList, setCategoryList] = useState<UserCategoriesList[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [reportList, setReportList] = useState<ReportList[]>([]);

  useEffect(() => {
    //카테고리
    const getCategory = async () => {
      try {
        const result = await getcategoriesList();
        if (result.status === "OK") setCategoryList(result.data.categories);
      } catch {
        setCategoryList([]);
      }
    };
    // Report
    const getReportList = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.STUDENT_REPORT.GET);
        if (response.data.status === "OK") {
          if (response.data.data) {
            setReportList(response.data.data);
          }
        }
      } catch {
        return null;
      }
    };

    getCategory();
    getReportList();
  }, []);

  const handleStartTest = async () => {
    if (selectedCategory === -1) {
      alert("카테고리를 선택해주세요");
      return;
    }
    try {
      const result = await levelTestApi(selectedCategory, auth.memberId);
      if (result) navigate(PAGE_PATHS.LEVEL_TEST.TEST);
    } catch {
      return null;
    }
  };

  const formatDate = (createdAt: number[]) => {
    const [year, month, day] = createdAt;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
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

  return (
    <Container>
      <CategorySelectWrapper>
        <PageTitle>Level Test</PageTitle>
        <CategorySelectBox>
          <CategoryTitle>레벨 테스트할 카테고리를 선택해 주세요.</CategoryTitle>
          <CategoryContainer>
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
            <CategoryButton>
              <Button text="시험 시작" onClick={handleStartTest} />
            </CategoryButton>
          </CategoryContainer>
        </CategorySelectBox>
      </CategorySelectWrapper>

      <ReportListWrapper>
        <ReportTitle>Report</ReportTitle>
        <ReportContainer>
          {reportList.length > 0 ? (
            reportList.map((report, index) => (
              <ReportCard
                key={report.reportId}
                onClick={() => handleReportClick(report.reportId)}
              >
                <ReportInfo>
                  <ReportNumber>{index + 1}</ReportNumber>
                  <ReportDate>{formatDate(report.createdAt)}</ReportDate>
                  <ReportCategory>{report.category}</ReportCategory>
                  <StudentLevelIcon
                    src={getLevelIcon(report.studentLevel)}
                    alt="Level Icon"
                  />
                  <ReportScore>Score : {report.totalScore} / 100</ReportScore>
                </ReportInfo>
              </ReportCard>
            ))
          ) : (
            <EmptyListMessage>
              아직 레벨테스트 결과가 없습니다. 위에서 테스트를 시작해보세요.
            </EmptyListMessage>
          )}
        </ReportContainer>
      </ReportListWrapper>
    </Container>
  );
};

export default LevelTestDashboardPage;
