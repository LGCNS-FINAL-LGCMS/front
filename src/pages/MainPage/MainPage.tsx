import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate, generatePath } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";
import SearchBar from "../../components/Common/SearchBar";
import { theme } from "../../assets/styles/theme";
import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";
import CategoryButtons from "../../components/CategoryButtons/CategoryButtons";
import { login } from "../../redux/token/tokenSlice";
import { PAGE_PATHS } from "../../constants/pagePaths";

const CenteredWrapper = styled.div`
  justify-content: center;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  min-height: calc(100vh - ${theme.size.header.height} - 40px);
  width: 100%;
  box-sizing: border-box;
`;

const Container = styled.div`
  padding: 0rem;
  width: 100%;
  height: 
  max-width: 1200px;
`;

const ScrollableContainer = styled.div`
  height: calc(100vh - ${theme.size.header.height} - 195px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.header}; /* 스크롤바 색상 */
    border-radius: 10px; /* 스크롤바 둥근 모서리 */
    border: 2px solid ${theme.colors.header}; /* 테두리 색상 */
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.header}; /* 스크롤바 트랙 색상 */
    border-radius: 10px; /* 트랙의 둥근 모서리 */
  }

  /* IE / Edge 에서 지원하는 스크롤바 */
  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.header} ${theme.colors.gray_L};
`;

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const [localSearchKeyword, setLocalSearchKeyword] = useState(keyword || "");

  const currentCategoryFromStore = useSelector(
    (state: any) => state.category.category
  );

  const handleKeywordSearch = () => {};

  const handleLogin = (accessToken: string, refreshToken: string) => {
    dispatch(login({ accessToken, refreshToken }));
  };

  // urlKeyword가 바뀔 때마다 localSearchKeyword 동기화 및 redux 상태 설정
  useEffect(() => {
    // keyword 동기화
    if (keyword) {
      setLocalSearchKeyword(keyword);
      dispatch(setKeyword(keyword));
    } else {
      setLocalSearchKeyword("");
      dispatch(clearKeyword());
    }
  }, [keyword, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchKeyword(e.target.value);
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      dispatch(setKeyword(trimmedQuery));

      const url = generatePath(`${PAGE_PATHS.HOME}/:keyword?/:category?`, {
        keyword: trimmedQuery || null,
        category: currentCategoryFromStore || null,
      });

      navigate(url);
    }
  };
  return (
    <CenteredWrapper>
      <Container>
        <button
          onClick={() =>
            handleLogin(
              "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsZ2NtcyIsInN1YiI6IjIiLCJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJqdGkiOiIxZjc1NWU5NC04MjY2LTRhYTgtOGYwNy1hNGI3ZDUzYjZhNDQiLCJpYXQiOjE3NTQ2NDYxOTUsImV4cCI6MTc1NDY1Njk5NX0._hDj2BUXcX42xU4J3T4bdBrRztoyHQChD9BwkrCTWA_KszIN52l6ANBOsfYfQDvZiSq4W6xWzjx4T-IZNiVEQg",
              "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsZ2NtcyIsInN1YiI6IjIiLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwianRpIjoiMWY3NTVlOTQtODI2Ni00YWE4LThmMDctYTRiN2Q1M2I2YTQ0IiwiaWF0IjoxNzU0NjQ2MTk1LCJleHAiOjE3NTQ3MzI1OTV9.jums51S06H-9FigLF3jdeu5vBAhfs8eW4vrtlZ-CmGY9fK6Ixt2imSQzwzGDbJ0pu93DYtXmhH7YYNBEWgSpRA"
            )
          }
        >
          add token
        </button>
        <SearchBar
          value={localSearchKeyword}
          onChange={handleInputChange}
          onSearch={handleSearch}
          design={2}
          fontColor={1}
        />
        <CategoryButtons onCategoryClick={handleKeywordSearch} />
        <ScrollableContainer>
          <InfiniteScrollController />
        </ScrollableContainer>
      </Container>
    </CenteredWrapper>
  );
};

export default MainPage;
