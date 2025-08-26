import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import type { RootState } from "../../redux/store";

import LectureInfoHeader from "../../components/LectureInfo/LectureInfoHeader";
import LectureInfoTabMenu from "../../components/LectureInfo/LectureInfoTabMenu";
import CurriculumList from "../../components/LectureInfo/CurriculumList";
import AddReviewModal from "../../components/LectureInfo/AddReviewModal";
import AddQnaModal from "../../components/LectureInfo/AddQnaModal";
import { postQnaRequest } from "../../api/Qna/QnaAPI";
import {
  getReviewRequest,
  postReviewRequest,
} from "../../api/Review/reviewAPI";
import type { Review } from "../../types/review";
import ReviewCard from "../../components/LectureInfo/ReviewCard";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Common/Button";

const Wrapper = styled.div`
  display: flex;

  font-family: ${({ theme }) => theme.font.primary};
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height} - 2.5rem);
  max-width: ${({ theme }) => theme.size.containerMax};
  margin: 0 auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background_B};
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1.5rem;
  padding-top: 1rem;
  flex: 1;
`;

const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const RightPane = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background_B};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
`;

const Star = styled.span`
  color: #ffcc00;
  font-size: 2rem;
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const RatingNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const StarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const ReviewCount = styled.p`
  margin-top: 8px;
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.gray_D};
`;

const QnaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const QnaText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.gray_D};
`;

type TabType = "curriculum" | "reviews" | "qna";

const LectureInfoPage = () => {
  // todo: 이거 클릭한 강의로 바꾸기
  const lecture = useSelector(
    (state: RootState) => state.lectureData.lectureList[0]
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );

  // 구매 여부
  const isPurchased: boolean = true;
  const progress: number = 70;
  const [activeTab, setActiveTab] = useState<TabType>("curriculum");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isAddQnaModalOpen, setIsAddQnaModalOpen] = useState(false);

  const lessons = Array.from({ length: 10 }).map((_, i) => ({
    title: `레슨 ${i + 1} - 제목`,
    duration: "23분",
  }));

  useEffect(() => {
    if (!lecture?.lectureId) return;

    const fetchReviews = async () => {
      try {
        const data = await getReviewRequest(lecture.lectureId);
        setReviews(data);
      } catch (err) {
        console.error(err);
        setReviews([
          {
            comment:
              "정말 좋은 강의였습니다! 쉽게 설명해주셔서 이해가 잘 돼요.",
            nickname: "홍길동",
            star: 5,
            createdAt: [2025, 8, 21, 10, 0, 0, 0], // 년, 월, 일, 시, 분, 초, 밀리초
          },
          {
            comment: "중간중간 예시가 부족해서 아쉬웠습니다.",
            nickname: "김철수",
            star: 3,
            createdAt: [2025, 8, 20, 15, 30, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
          {
            comment: "입문자가 듣기에 아주 좋아요. 추천합니다!",
            nickname: "이영희",
            star: 4,
            createdAt: [2025, 8, 19, 8, 45, 0, 0],
          },
        ]);
      }
    };

    fetchReviews();
  }, [lecture?.lectureId]);

  return (
    <Wrapper>
      <LectureInfoHeader
        lecture={lecture}
        purchased={isPurchased}
        progress={progress}
      />

      <LectureInfoTabMenu
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewCount={lecture?.reviewCount ?? 0}
      />

      <Content>
        <LeftPane>
          {activeTab === "curriculum" && <CurriculumList lessons={lessons} />}
          {activeTab === "reviews" && (
            <>
              <ReviewWrapper>
                {" "}
                <RatingNumber>{lecture?.averageStar ?? 0}</RatingNumber>{" "}
                <StarRow>
                  {" "}
                  {Array.from({
                    length: Math.floor(lecture?.averageStar ?? 0),
                  }).map((_, idx) => (
                    <Star key={idx}>★</Star>
                  ))}{" "}
                  {(lecture?.averageStar ?? 0) % 1 !== 0 && <Star>☆</Star>}{" "}
                </StarRow>{" "}
                <ReviewCount>{lecture?.reviewCount}개의 리뷰</ReviewCount>{" "}
                {isAuthenticated && isPurchased && (
                  <Button
                    text="리뷰 등록"
                    onClick={() => {
                      setIsAddReviewModalOpen(true);
                    }}
                  />
                )}
              </ReviewWrapper>
            </>
          )}
          {activeTab === "qna" && (
            <QnaWrapper>
              <IconWrapper>
                <FontAwesomeIcon icon={faCircleQuestion} />
              </IconWrapper>
              <QnaText>
                {isAuthenticated
                  ? "수강 관련 문의 사항을 적어주세요"
                  : "로그인 후 Q&A를 이용해 주세요"}
              </QnaText>
              {isAuthenticated && (
                <Button
                  text="문의 작성하기"
                  onClick={() => setIsAddQnaModalOpen(true)}
                />
              )}
            </QnaWrapper>
          )}
        </LeftPane>

        <RightPane>
          {activeTab === "reviews" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              {reviews.map((review, idx) => (
                <ReviewCard key={idx} review={review} />
              ))}
            </div>
          )}
          {activeTab === "qna" && <div>Q&A 영역</div>}
        </RightPane>
      </Content>

      <AddReviewModal
        visible={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await postReviewRequest(lecture.lectureId, data);
            const updatedReviews = await getReviewRequest(lecture.lectureId);
            setReviews(updatedReviews);
            setIsAddReviewModalOpen(false);
          } catch (err) {
            console.error(err);
            alert("리뷰 등록 실패");
          }
        }}
        questions={[
          { question: "이번 강의가 도움이 되었나요?" },
          { question: "강사님은 괜찮았나요?" },
        ]}
      />

      <AddQnaModal
        visible={isAddQnaModalOpen}
        onClose={() => setIsAddQnaModalOpen(false)}
        lectureId={lecture.lectureId}
        onSubmit={async (data) => {
          try {
            await postQnaRequest(data);
            setIsAddQnaModalOpen(false);
          } catch (err) {
            console.error(err);
            alert("문의 작성 실패");
          }
        }}
      />
    </Wrapper>
  );
};

export default LectureInfoPage;
