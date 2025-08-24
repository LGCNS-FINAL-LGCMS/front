import { useEffect, useState } from "react";
import styled from "styled-components";
import { getcategoriesList } from "../../api/Signup/signupAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { levelTestApi } from "../../utils/sessionStorage/levelTest";
import type { UserCategoriesList } from "../../types/authInfo";
import Button from "../../components/Common/Button";

const LevelTestDashboardContainer = styled.div`
  font-family: ${(props) => props.theme.font.primary};
`;

const CategorySelectContainer = styled.div`
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const Title = styled.p`
  margin: 0 0 50px 0;
  width: 1080px;
  border-bottom: 2px solid;
  font-size: ${(props) => props.theme.fontSize.title.max};
`;

const TestCategorySelectSection = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  margin: 20px;
`;

const CategoryTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.subtitle};

  color: #333;
  margin: 0;
  font-weight: 500;
`;

const CategoryDropdown = styled.select`
  font-size: ${(props) => props.theme.fontSize.body.min};

  padding: 12px 16px;
  border-radius: 20px; /* 둥근 모서리 */
  border: 2px solid #ddd;
  background-color: white;
  font-size: 16px;
  min-width: 200px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  margin: 20px;

  &:hover {
    border-color: #999;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  /* 화살표 커스터마이징 */
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
`;

const CategoryOption = styled.option``;

const PastTestReportsSection = styled.div``;

const LevelTestDashboardPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [CategoryList, setCategoryList] = useState<UserCategoriesList[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);

  // 카테고리 조회
  const getCategory = async () => {
    try {
      const result = await getcategoriesList();
      if (result.status === "OK") {
        setCategoryList(result.data.categories);
      } else {
        throw new Error(
          result.data.message || "레벨 테스트 문제 비즈니스 로직 에러"
        );
      }
    } catch (error: unknown) {
      console.log("카테고리 API 호출 실패", error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  // nickname,categoryId 보내기
  const handleStartTest = async () => {
    if (selectedCategory === -1) {
      alert("카테고리를 선택해주세요");
      return;
    }

    try {
      const result = await levelTestApi(selectedCategory, auth.memberId);
      if (result) {
        console.log("request 완료");
      } else {
        console.log("request 전달 실패");
      }
    } catch (error) {
      console.log("레벨 테스트 API 호출 실패", error);
    }
  };

  return (
    <LevelTestDashboardContainer>
      <Title>Level Test</Title>
      <CategorySelectContainer>
        <CategoryTitle>레벨 테스트할 Category를 선택해주세요.</CategoryTitle>
        <TestCategorySelectSection>
          <CategoryDropdown
            value={selectedCategory} // 현재 선택된 값
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
          >
            <CategoryOption value={-1} disabled hidden>
              카테고리를 선택하세요
            </CategoryOption>
            {CategoryList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </CategoryDropdown>
          <Button text="시험 시작" onClick={handleStartTest} />
        </TestCategorySelectSection>
      </CategorySelectContainer>
      <PastTestReportsSection></PastTestReportsSection>
    </LevelTestDashboardContainer>
  );
};

export default LevelTestDashboardPage;
