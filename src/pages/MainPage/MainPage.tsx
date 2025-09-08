import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/Category/categorySlice";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";
import SearchBar from "../../components/Common/SearchBar";
import { theme } from "../../assets/styles/theme";
import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";
import CategoryButtons from "../../components/CategoryButtons/CategoryButtons";
import Sidebar from "../../components/MainPageSideBar/MainPageSideBar";
import type { RootState } from "../../redux/store";

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
  height: 100%;
  max-width: 1200px;
`;

const ScrollableContainer = styled.div.attrs({ id: "scrollableDiv" })`
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

const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams<{ keyword?: string }>();
  const currentKeyword = useSelector(
    (state: RootState) => state.keyword.searchText
  );

  const [localSearchKeyword, setLocalSearchKeyword] = useState(
    currentKeyword || ""
  );

  useEffect(() => {
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
    if (trimmedQuery === currentKeyword) return;
    dispatch(setKeyword(trimmedQuery));
  };

  return (
    <CenteredWrapper>
      <Container>
        <Sidebar />

        <SearchBar
          value={localSearchKeyword}
          onChange={handleInputChange}
          onSearch={handleSearch}
          design={1}
          fontColor={2}
        />

        <CategoryButtons />

        <ScrollableContainer>
          <InfiniteScrollController />
        </ScrollableContainer>
      </Container>
    </CenteredWrapper>
  );
};

export default MainPage;
