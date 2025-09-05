import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
import InterestSelector from "../Common/InterestSelector";
import { getcategoriesList } from "../../api/Signup/signupAPI";
import type { UserCategoriesList } from "../../types/authInfo";
import type { Interest } from "../../types/interset";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store"; // store 타입 확인
import { getErrorMessage } from "../../utils/handleApiError";

// 카테고리 선택
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
  margin: 10px;
`;

const CategoryGrid = styled.div`
  text-align: center;
`;

const CategoryCountMessage = styled.p`
  font-size: ${(props) => props.theme.fontSize.small.max};
  color: ${(props) => props.theme.colors.caution};
  font-family: ${({ theme }) => theme.font.primary};
  text-align: center;
  display: block;
`;

interface CategorySelectProps {
  onCategoryChange: (categories: UserCategoriesList[]) => void;
}

const CategorySelect = ({ onCategoryChange }: CategorySelectProps) => {
  const reduxCategories = useSelector(
    (state: RootState) => state.auth.categories
  );

  const [interests, setInterests] = useState<Interest[]>([]);

  const [categoriesCountMessage, setCategoriesCountMessage] = useState("");

  //선택된 카테고리들
  const handleSelectionChange = useCallback(
    (selected: Interest[]) => {
      const count = selected.length;

      if (count === 0) {
        setCategoriesCountMessage("최소 1개의 카테고리를 선택해주세요.");
      } else if (count >= 5) {
        setCategoriesCountMessage(
          "카테고리는 최대 5개까지 선택할 수 있습니다."
        );
      } else {
        setCategoriesCountMessage("");
      }

      // 카테고리가 1~5개 일때만 전달
      if (count >= 1 && count <= 5) {
        const convertedCategories: UserCategoriesList[] = selected.map(
          (item) => ({
            id: Number(item.id),
            name: item.name,
          })
        );
        onCategoryChange(convertedCategories);
      } else {
        onCategoryChange([]);
      }
    },
    [onCategoryChange]
  );

  // 카테고리 가져오기
  const getCategories = async () => {
    try {
      const result = await getcategoriesList();
      if (result.status === "OK") {
        const formattedCategories = result.data.categories.map(
          (category: Interest) => ({
            id: category.id,
            name: category.name,
          })
        );
        setInterests(formattedCategories);
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error, "카테고리 서버 에러 발생");
      console.error(message);
      setInterests([]);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <CategorySection>
      <CategoryGrid>
        <InterestSelector
          initialSelected={reduxCategories}
          interests={interests}
          onSelectionChange={handleSelectionChange}
        />
      </CategoryGrid>
      <CategoryCountMessage>{categoriesCountMessage}</CategoryCountMessage>
    </CategorySection>
  );
};

export default CategorySelect;
