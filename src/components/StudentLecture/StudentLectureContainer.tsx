import { useEffect } from "react";
import styled from "styled-components";
import LectureCard from "../Common/LectureCard";
import LectureCardSkeleton from "../LectureCardSkeleton/LectureCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchStudentLecturePage,
  resetPaginationState,
  setCurrentPage,
} from "../../redux/lectureData/studentPageData/studentPageDataSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import type { Lecture } from "../../types/lecture";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { PAGE_PATHS } from "../../constants/pagePaths";

// 카드 그리드
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
    grid-template-columns: repeat(2, 1fr);
  }
`;

// 페이지네이션 컨테이너
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const CustomPaginationItem = styled(Pagination.Item)`
  & .page-link {
    background-color: ${({ theme }) => theme.colors.gray_L};
    color: ${({ theme }) => theme.colors.text_D};
    font-family: ${({ theme }) => theme.font.primary};
    font-weight: 400;
    border: 1px solid ${({ theme }) => theme.colors.gray_M};
    transition: ${({ theme }) => theme.transition.default};

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray_M};
    }
  }

  &.active .page-link {
    background-color: ${({ theme }) => theme.colors.gray_D};
    color: ${({ theme }) => theme.colors.text_B};
    font-weight: 700;
  }
`;

const CustomPaginationButton = styled(Pagination.First)`
  & .page-link {
    background-color: ${({ theme }) => theme.colors.gray_L};
    color: ${({ theme }) => theme.colors.text_D};
    font-weight: 400;
    border: 1px solid ${({ theme }) => theme.colors.gray_M};
    transition: ${({ theme }) => theme.transition.default};

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray_M};
    }
    &.disabled {
      background-color: ${({ theme }) => theme.colors.gray_L};
      color: ${({ theme }) => theme.colors.text_D};
      opacity: 0.6;
      border-color: ${({ theme }) => theme.colors.gray_M};
    }
  }
`;

const PAGE_SIZE = 12;

const StudnetLectureContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { lectureList, status, totalCount, currentPage, pageSize } =
    useSelector((state: RootState) => state.studentLectureData);

  const totalPages = Math.ceil(totalCount / pageSize);

  // keyword/category 바뀔 때 첫 페이지 로딩
  useEffect(() => {
    dispatch(resetPaginationState());
    dispatch(
      fetchStudentLecturePage({
        page: 0,
        size: PAGE_SIZE,
      })
    );
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setCurrentPage(page));
    dispatch(
      fetchStudentLecturePage({
        page: page - 1,
        size: PAGE_SIZE,
      })
    );
  };

  //강의 상세 페이지 버튼
  const handleLecturePageButton = () => {
    navigate(PAGE_PATHS.HOME);
  };
  // lesson 보러가기
  const handleLessonPageButton = () => {
    navigate(PAGE_PATHS.HOME);
  };

  return (
    <>
      {status === "loading" ? (
        <CardsGrid>
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <LectureCardSkeleton key={`skeleton-${i}`} />
          ))}
        </CardsGrid>
      ) : (
        <CardsGrid>
          {lectureList.map((item: Lecture) => (
            <LectureCard
              key={item.lectureId}
              id={item.lectureId}
              imageUrl={item.thumbnail ?? ""}
              title={item.title ?? "제목 없음"}
              description={item.description ?? "설명이 없습니다"}
              lecturer={item.nickname ?? "강사 미정"}
              price={item.price}
              rating={item.averageStar}
              reviewCount={item.reviewCount ?? 0}
              progress={item.progress ?? 0}
              design={1}
              buttons={[
                {
                  label: "강의 상세보기",
                  onClick: () =>
                    navigate(`${PAGE_PATHS.LECTURE_INFO}/${item.lectureId}`),
                },
                {
                  label: "강의 보러가기",
                  onClick: () =>
                    navigate(`${PAGE_PATHS.LESSON_VIEW}/${item.lectureId}`),
                },
              ]}
            />
          ))}
        </CardsGrid>
      )}

      <PaginationContainer>
        <Pagination>
          <CustomPaginationButton
            as={Pagination.First}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <CustomPaginationButton
            as={Pagination.Prev}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <CustomPaginationItem
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </CustomPaginationItem>
          ))}
          <CustomPaginationButton
            as={Pagination.Next}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <CustomPaginationButton
            as={Pagination.Last}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </PaginationContainer>
    </>
  );
};

export default StudnetLectureContainer;
