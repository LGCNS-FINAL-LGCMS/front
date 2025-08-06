import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";
import SearchBar from "../../components/Common/SearchBar";
import { theme } from "../../assets/styles/theme";
import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";
import KeywordButtons from "../../components/KeywordButtons/KeywordButtons";

const CenteredWrapper = styled.div`
  justify-content: center;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  min-height: calc(100vh - ${theme.size.header.height});
  width: 100%;
  box-sizing: border-box;
`;

const Container = styled.div`
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyword } = useParams(); // keyword가 없으면 undefined

  const [localSearchKeyword, setLocalSearchKeyword] = useState(keyword || "");

  const handleKeywordButtonClick = (keyword: string) => {
    setLocalSearchKeyword(keyword);
    handleSearch(keyword);
  };

  // urlKeyword가 바뀔 때마다 localSearchKeyword 동기화 및 redux 상태 설정
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
    if (trimmedQuery) {
      dispatch(setKeyword(trimmedQuery));
      navigate(`/${trimmedQuery}`);
    }
  };

  return (
    <CenteredWrapper>
      <Container>
        <SearchBar
          value={localSearchKeyword}
          onChange={handleInputChange}
          onSearch={handleSearch}
          design={2}
          fontColor={1}
        />
        <KeywordButtons onKeywordClick={handleKeywordButtonClick} />
        <InfiniteScrollController />
      </Container>
    </CenteredWrapper>
  );
};

export default MainPage;
