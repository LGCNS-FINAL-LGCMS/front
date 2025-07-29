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

  // lectureData slice 상태 가져오기
  const {
    lectureList,
    status: lectureStatus,
    hasMore: lectureHasMore,
  } = useSelector((state: RootState) => state.lectureData);

  const isAuthenticated = useSelector(
    // (state: RootState) => state.token.isAuthenticated
    (state: RootState) => true
  );

  const [start, setStart] = useState<number>(INFO_START_INDEX);
  const dispatch = useDispatch<AppDispatch>();

  const prevKeywordRef = useRef<string | null>(null);
  const keywordFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const fetchLecture = async (isKeywordSearch = false) => {
    if (keywordFetchTimeoutRef.current) {
      clearTimeout(keywordFetchTimeoutRef.current);
    }

    const currentOffset = isKeywordSearch ? INFO_START_INDEX : start;

    try {
      const lectureAction = await dispatch(
        fetchLectureData({
          search: currentKeywordFromStore,
          page: currentOffset,
          size: INFO_DISPLAY_INDEX,
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
    if (!currentKeywordFromStore) {
      fetchLecture(true);
    }

    return () => {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }
    };
  }, [currentKeywordFromStore]);

  useEffect(() => {
    if (
      currentKeywordFromStore &&
      currentKeywordFromStore !== prevKeywordRef.current
    ) {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }

      dispatch(resetLectureDataState());
      setStart(INFO_START_INDEX);
      fetchLecture(true);
      prevKeywordRef.current = currentKeywordFromStore;
    } else if (!currentKeywordFromStore && prevKeywordRef.current) {
      dispatch(resetLectureDataState());
      prevKeywordRef.current = null;
      setStart(INFO_START_INDEX);

      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
        keywordFetchTimeoutRef.current = null;
      }
    }

    return () => {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }
    };
  }, [currentKeywordFromStore, dispatch]);

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
        lectureList.length > 0 &&
        !lectureHasMore &&
        lectureStatus !== "loading" ? (
          <p style={{ textAlign: "center" }}>
            <b>더 이상 강의 정보가 없습니다.</b>
          </p>
        ) : null
      }
      scrollThreshold={"50%"}
    >
      <CardsGrid>
        {lectureList.map((item: Lecture, index: number) => (
          <LectureCard
            key={item.id}
            imageUrl={item.imageUrl ?? "/default-image-path.jpg"}
            title={item.description ?? "제목 없음"}
            description={item.description}
            lecturer={item.lecturer}
            onClick={() => console.log(item.id)}
            design={1}
          />
        ))}
      </CardsGrid>
    </InfiniteScroll>
  );
};

export default InfiniteScrollController;
