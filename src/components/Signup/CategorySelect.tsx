import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
import InterestSelector from "../Common/InterestSelector";
import { categoriesList } from "../../api/Signup/signupAPI";
import type { CategoryFormat } from "../../api/Signup/signupAPI";

// 카테고리 선택
const CategorySection = styled.div`
  text-align: center;
  padding: 10px;
`;

const CategoryTitle = styled.h1`
  text-align: center;
  margin: 20px; // 위아래 간격

  font-size: ${(props) => props.theme.fontSize.title.min};
`;

const CategorySubTitle = styled.p`
  text-align: center;
`;

const CategoryGrid = styled.div`
  text-align: center;
  padding: 20px;
  margin: 30px 0 30px 0; // 위 오른쪽 아래 왼쪽
`;

export type Interest = {
  id: string;
  name: string;
};

interface CategorySelectProps {
  onCategoryChange: (categories: CategoryFormat[]) => void;
}

const CategorySelect = ({ onCategoryChange }: CategorySelectProps) => {
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryFormat[]
  >([]);

  const [interests, setInterests] = useState<Interest[]>([]);

  const handleSelectionChange = useCallback(
    (selected: Interest[]) => {
      // id 타입 변경
      const convertedCategories: CategoryFormat[] = selected.map((item) => ({
        id: Number(item.id),
        name: item.name,
      }));
      console.log("Categories[] : ", selectedCategories);
      setSelectedCategories(convertedCategories);
      onCategoryChange(convertedCategories);
    },
    [onCategoryChange, selectedCategories]
  );

  // 카테고리 가져오기
  const getCategories = async () => {
    try {
      const result = await categoriesList();
      if (result.status == "OK") {
        console.log("카테고리 서버연결성공", result.status);
        const formattedCategories = result.data.categories.map(
          (category: CategoryFormat) => ({
            id: String(category.id),
            name: category.name,
          })
        );
        setInterests(formattedCategories);
      }
    } catch (error) {
      console.log("카테고리 서버에러발생", error);
      setInterests([]); //에러 발생 시 빈배열로 초기화
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <CategorySection>
      <CategoryTitle>Category</CategoryTitle>
      <CategorySubTitle>관심있는 카테고리를 추가하세요.</CategorySubTitle>

      <CategoryGrid>
        <InterestSelector
          interests={interests}
          onSelectionChange={handleSelectionChange}
        />
      </CategoryGrid>
    </CategorySection>
  );
};

export default CategorySelect;
