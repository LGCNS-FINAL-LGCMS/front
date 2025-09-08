import { useState, useEffect } from "react";
import styled from "styled-components";
import LectureCard from "../Common/LectureCard";
import LectureCardSkeleton from "../LectureCardSkeleton/LectureCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fetchLecturePage,
  resetPaginationState,
  setCurrentPage,
} from "../../redux/lectureData/lecturerPageData/lecturerPageData";
import type { RootState, AppDispatch } from "../../redux/store";
import type { Lecture } from "../../types/lecture";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { publishLectureRequest } from "../../api/Lecture/lectureAPI";
import Button from "../Common/Button";

export interface LectureWithStatus extends Lecture {
  status: string;
}

interface ModalProps {
  message: string;
  onClose: () => void;
}

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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.background_Overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalBox = styled.div<{ isSuccess: boolean }>`
  background: #fff;
  width: ${({ theme }) => theme.size.modal.width};
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  text-align: center;
  animation: fadeIn 0.3s ${({ theme }) => theme.transition.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h2 {
    font-size: ${({ theme }) => theme.fontSize.title.max};
    color: ${({ isSuccess, theme }) =>
      isSuccess ? theme.colors.success : theme.colors.danger};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    font-size: ${({ theme }) => theme.fontSize.body.max};
    color: ${({ theme }) => theme.colors.text_D};
    margin: 0;
  }
`;

const Modal: React.FC<ModalProps & { isSuccess?: boolean }> = ({
  message,
  onClose,
  isSuccess = true,
}) => (
  <Overlay onClick={onClose}>
    <ModalBox onClick={(e) => e.stopPropagation()} isSuccess={isSuccess}>
      <h2>
        <FontAwesomeIcon
          icon={isSuccess ? faCircleCheck : faCircleXmark}
          size="2x"
        />
        {isSuccess ? "성공" : "실패"}
      </h2>
      <p>{message}</p>
      <div style={{ marginTop: "1rem" }}>
        <Button text="확인" onClick={onClose} design={1} />
      </div>
    </ModalBox>
  </Overlay>
);

const PAGE_SIZE = 12;

const LecturerLectureContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { lectureList, status, totalCount, currentPage, pageSize } =
    useSelector((state: RootState) => state.lecturerLectureData);

  const keyword = useSelector((state: RootState) => state.keyword.searchText);
  const category = useSelector((state: RootState) => state.category.category);
  const totalPages = Math.ceil(totalCount / pageSize);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    dispatch(resetPaginationState());
    dispatch(
      fetchLecturePage({
        page: 0,
        size: PAGE_SIZE,
      })
    );
    dispatch(setCurrentPage(1));
  }, [keyword, category, dispatch]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setCurrentPage(page));
    dispatch(
      fetchLecturePage({
        page: page - 1,
        size: PAGE_SIZE,
      })
    );
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
          {lectureList.map((item: LectureWithStatus) => (
            <LectureCard
              key={item.lectureId}
              id={item.lectureId}
              imageUrl={item.thumbnail || ""}
              title={item.title ?? "제목 없음"}
              description={item.description ?? "설명이 없습니다"}
              lecturer={item.nickname ?? "강사 미정"}
              price={item.price}
              rating={item.averageStar}
              design={1}
              reviewCount={item.reviewCount ?? 0}
              buttons={[
                ...(item.status !== "APPROVED"
                  ? [
                      {
                        label: "강의 출시",
                        onClick: async () => {
                          try {
                            await publishLectureRequest(
                              item.lectureId,
                              "APPROVED"
                            );
                            dispatch(
                              fetchLecturePage({
                                page: currentPage - 1,
                                size: PAGE_SIZE,
                              })
                            );
                            setIsSuccess(true); // 성공
                            setModalMessage(
                              "강의를 성공적으로 출시하였습니다."
                            );
                          } catch (error) {
                            setIsSuccess(false); // 실패
                            if (error instanceof Error)
                              setModalMessage(error.message);
                            else
                              setModalMessage(
                                "알 수 없는 오류가 발생했습니다."
                              );
                          }
                        },
                      },
                    ]
                  : []),
                {
                  label: "강의 정보 보기",
                  onClick: () =>
                    navigate(`${PAGE_PATHS.LECTURE_INFO}/${item.lectureId}`),
                },
                {
                  label: "강좌 추가하기",
                  onClick: () =>
                    navigate(
                      `${PAGE_PATHS.LESSON_MANAGEMENT}/${item.lectureId}`
                    ),
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
      {modalMessage && (
        <Modal
          message={modalMessage}
          onClose={() => setModalMessage(null)}
          isSuccess={isSuccess}
        />
      )}
    </>
  );
};

export default LecturerLectureContainer;
