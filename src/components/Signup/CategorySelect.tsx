import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
import InterestSelector from "../Common/InterestSelector";
import { getcategoriesList } from "../../api/Signup/signupAPI";
import type { UserCategoriesList } from "../../types/authInfo";
import type { Interest } from "../../types/interset";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store"; // store 타입 확인

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

interface CategorySelectProps {
  onCategoryChange: (categories: UserCategoriesList[]) => void;
}

const CategorySelect = ({ onCategoryChange }: CategorySelectProps) => {
  const reduxCategories = useSelector(
    (state: RootState) => state.auth.categories
  );

  // string로 category
  const [_selectedCategories, setSelectedCategories] = useState<
    UserCategoriesList[]
  >([]);
  // numebr로 category
  const [interests, setInterests] = useState<Interest[]>([]);

  //선택된 카테고리들
  const handleSelectionChange = useCallback(
    (selected: Interest[]) => {
      // id 타입 변경
      const convertedCategories: UserCategoriesList[] = selected.map(
        (item) => ({
          id: Number(item.id),
          name: item.name,
        })
      );
      setSelectedCategories(convertedCategories);
      onCategoryChange(convertedCategories);
    },
    [onCategoryChange]
  );

  // 카테고리 가져오기
  const getCategories = async () => {
    try {
      const result = await getcategoriesList();
      if (result.status == "OK") {
        const formattedCategories = result.data.categories.map(
          (category: Interest) => ({
            id: category.id,
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
          initialSelected={reduxCategories}
          interests={interests}
          onSelectionChange={handleSelectionChange}
        />
      </CategoryGrid>
    </CategorySection>
  );
};

export default CategorySelect;
