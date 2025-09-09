import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

// const StickyWrapper = styled.div`
//   position: sticky;
//   top: ${theme.size.header.height};
//   z-index: 50;
//   background-color: ${({ theme }) => theme.colors.background_B};
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   padding: 0.5rem 0;
// `;

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

        <InfiniteScrollController />
      </Container>
    </CenteredWrapper>
  );
};

export default MainPage;
