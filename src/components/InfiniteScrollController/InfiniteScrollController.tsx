import { useEffect, useState, useRef, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import LectureCard from "../Common/LectureCard";
import LectureCardSkeleton from "../LectureCardSkeleton/LectureCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLectureData,
  resetLectureDataState,
} from "../../redux/lectureData/lectureDataSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import type { Lecture } from "../../types/lecture";
import { theme } from "../../assets/styles/theme";
import { PAGE_PATHS } from "../../constants/pagePaths";

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 250px);
  gap: 10px;
  padding: 0.2rem;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 2fr;
  }
`;

const INFO_START_INDEX = 0;
const INFO_DISPLAY_INDEX = 12;
const KEYWORD_FETCH_DELAY = 1750;

const InfiniteScrollController: React.FC = () => {
  const navigate = useNavigate();
  // 키워드 가져오기
  const currentKeywordFromStore = useSelector(
    (state: RootState) => state.keyword.searchText
  );

  // 카테고리
  const currentCategoryFromStore = useSelector(
    (state: RootState) => state.category.category
  );

  // lectureData slice 상태 가져오기
  const {
    lectureList,
    status: lectureStatus,
    hasMore: lectureHasMore,
  } = useSelector((state: RootState) => state.lectureData);

  const isAuthenticated = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );

  const [start, setStart] = useState<number>(INFO_START_INDEX);
  const dispatch = useDispatch<AppDispatch>();

  const prevKeywordRef = useRef<string | null>(null);
  const prevCategoryRef = useRef<string | null>(null);
  const keywordFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const fetchLecture = useCallback(
    async (isKeywordSearch = false) => {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }

      try {
        const lectureAction = await dispatch(
          fetchLectureData({
            keyword: currentKeywordFromStore,
            category: currentCategoryFromStore,
            page: isKeywordSearch ? INFO_START_INDEX : start,
          })
        );

        if (fetchLectureData.fulfilled.match(lectureAction)) {
          if (isKeywordSearch) {
            setStart(INFO_START_INDEX + 1);
          } else {
            setStart((prev) => prev + 1);
          }

          if (isAuthenticated) {
            keywordFetchTimeoutRef.current = setTimeout(() => {
              keywordFetchTimeoutRef.current = null;
            }, KEYWORD_FETCH_DELAY);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      currentKeywordFromStore,
      currentCategoryFromStore,
      start,
      dispatch,
      isAuthenticated,
    ]
  );

  useEffect(() => {
    const keywordChanged = currentKeywordFromStore !== prevKeywordRef.current;
    const categoryChanged =
      currentCategoryFromStore !== prevCategoryRef.current;

    if (keywordChanged || categoryChanged) {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }

      dispatch(resetLectureDataState());
      setStart(INFO_START_INDEX);
      fetchLecture(true);

      prevKeywordRef.current = currentKeywordFromStore;
      prevCategoryRef.current = currentCategoryFromStore;
    }

    if (!currentKeywordFromStore && prevKeywordRef.current) {
      dispatch(resetLectureDataState());
      setStart(INFO_START_INDEX);
      prevKeywordRef.current = null;
    }

    return () => {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }
    };
  }, [
    currentKeywordFromStore,
    currentCategoryFromStore,
    dispatch,
    fetchLecture,
  ]);

  const loadMoreLectures = () => {
    if (lectureStatus !== "loading" && lectureHasMore) {
      fetchLecture(false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={lectureList.length}
      next={loadMoreLectures}
      hasMore={lectureHasMore}
      loader={
        <CardsGrid>
          {[...Array(INFO_DISPLAY_INDEX)].map((_, index) => (
            <LectureCardSkeleton key={`lecture-skeleton-${index}`} />
          ))}
        </CardsGrid>
      }
      endMessage={
        lectureStatus === "failed" ? (
          <p style={{ textAlign: "center", color: theme.colors.danger }}>
            <b>강의 정보를 불러오지 못했습니다. 다시 시도해주세요.</b>
          </p>
        ) : lectureStatus === "succeeded" ? (
          lectureList.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              <b>검색 결과가 없습니다.</b>
            </p>
          ) : !lectureHasMore ? (
            <p style={{ textAlign: "center" }}>
              <b>더 이상 강의 정보가 없습니다.</b>
            </p>
          ) : null
        ) : null
      }
      scrollThreshold={"0%"}
      scrollableTarget="scrollableDiv"
    >
      <CardsGrid>
        {lectureList.map((item: Lecture) => (
          <LectureCard
            id={item.lectureId}
            imageUrl={item.thumbnail ?? ""}
            title={item.title ?? "제목 없음"}
            description={item.description ?? "설명이 없습니다"}
            lecturer={item.nickname ?? "강사 미정"}
            price={item.price}
            rating={item.averageStar}
            design={1}
            reviewCount={item.reviewCount ?? 0}
            onCardClick={() =>
              navigate(`${PAGE_PATHS.LECTURE_INFO}/${item.lectureId}`)
            }
          />
        ))}
      </CardsGrid>
    </InfiniteScroll>
  );
};

export default InfiniteScrollController;
