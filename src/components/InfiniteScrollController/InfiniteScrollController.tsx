import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import LectureCard from "../Common/LectureCard";
import LectureCardSkeleton from "../LectureCardSkeleton/LectureCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLectureData,
  resetLectureDataState,
} from "../../redux/lectureData/lectureDataSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import type { Lecture } from "../../types/lecture";
import img from "../../assets/Imgs/기본이미지.gif";

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

  const fetchLecture = async (isKeywordSearch = false) => {
    if (keywordFetchTimeoutRef.current) {
      clearTimeout(keywordFetchTimeoutRef.current);
    }

    // const currentOffset = isKeywordSearch ? INFO_START_INDEX : start;

    try {
      const lectureAction = await dispatch(
        fetchLectureData({
          keyword: currentKeywordFromStore,
          category: currentCategoryFromStore,
        })
      );

      if (fetchLectureData.fulfilled.match(lectureAction)) {
        if (isAuthenticated) {
          keywordFetchTimeoutRef.current = setTimeout(() => {
            keywordFetchTimeoutRef.current = null;
          }, KEYWORD_FETCH_DELAY);
        }
      }
    } catch (error) {
      console.error(error);
    }

    setStart((prev) => (isKeywordSearch ? INFO_START_INDEX + 1 : prev + 1));
  };

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

    // 키워드가 없고 이전에 키워드가 있었던 경우 초기화
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
  }, [currentKeywordFromStore, currentCategoryFromStore, dispatch]);

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
        lectureStatus === "succeeded" &&
        (lectureList.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            <b>검색 결과가 없습니다.</b>
          </p>
        ) : !lectureHasMore ? (
          <p style={{ textAlign: "center" }}>
            <b>더 이상 강의 정보가 없습니다.</b>
          </p>
        ) : null)
      }
      scrollThreshold={"90%"}
    >
      <CardsGrid>
        {lectureList.map((item: Lecture) => (
          <LectureCard
            id={item.lectureId}
            imageUrl={img}
            title={item.title ?? "제목 없음"}
            description={item.description ?? "설명이 없습니다"}
            lecturer={item.nickname ?? "강사 미정"}
            price={item.price}
            rating={item.averageStar}
            progress={24}
            design={1}
            buttons={[
              {
                label: "등록하기",
                onClick: () => {
                  alert(item.title);
                },
              },
              {
                label: "자세히 보기",
                onClick: () => {
                  alert("자세히 보기 클릭");
                },
              },
            ]}
          />
        ))}
      </CardsGrid>
    </InfiniteScroll>
  );
};

export default InfiniteScrollController;
