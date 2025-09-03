import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { clearCategory, setCategory } from "../../redux/Category/categorySlice";
import type { RootState } from "../../redux/store";

const CategorysWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

interface CategoryButtonsProps {
  onCategoryClick: (keyword: string, category: string) => void;
}

const Button = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  font-weight: 700;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.colors.header};
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border 0.3s;

  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.secondary : "transparent"};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.text_B : theme.colors.header};

  &:hover {
    background-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.gray_D : theme.colors.secondary};
    color: ${({ isActive, theme }) =>
      isActive ? theme.colors.text_B : theme.colors.text_B};
    border-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.gray_D : theme.colors.border_Dark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disable};
    color: #666;
    cursor: not-allowed;
    border: none;
  }
`;

// const shimmer = keyframes`
//   0% { background-position: -400px 0; }
//   100% { background-position: 400px 0; }
// `;

// const SkeletonButton = styled.div<{ width: string }>`
//   width: ${({ width }) => width};
//   height: 36px; /* 버튼 높이와 동일 */
//   background: linear-gradient(
//     90deg,
//     #bfbfbfff 25%,
//     #9d9d9dff 50%,
//     #bfbfbfff 75%
//   );
//   background-size: 800px 100%;
//   animation: ${shimmer} 1.2s infinite;
//   border-radius: 4px;
//   margin: 0 12px;
//   overflow: hidden;
// `;

interface CategoryButtonsProps {
  onCategoryClick: (keyword: string, category: string) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: RootState) => state.category);
  const myCategories = useSelector((state: RootState) => state.auth.categories);
  const selectedCategoryId = selectedCategory?.id
    ? Number(selectedCategory.id)
    : null;

  const handleButtonClick = (id: number, name: string) => {
    if (selectedCategoryId === id) {
      dispatch(clearCategory());
    } else {
      dispatch(setCategory({ id: id.toString(), category: name }));
    }
  };

  return (
    <CategorysWrapper>
      {myCategories.map((category) => (
        <Button
          key={category.id}
          isActive={selectedCategoryId === category.id}
          onClick={() => handleButtonClick(category.id, category.name)}
        >
          {category.name}
        </Button>
      ))}
    </CategorysWrapper>
  );
};

export default CategoryButtons;
