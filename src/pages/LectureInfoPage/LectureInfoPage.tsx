import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import type { Lecture } from "../../types/lecture";
import type { RootState } from "../../redux/store";
import LectureInfoHeader from "../../components/LectureInfo/LectureInfoHeader";
import LectureInfoTabMenu from "../../components/LectureInfo/LectureInfoTabMenu";
import CurriculumList from "../../components/LectureInfo/CurriculumList";
import AddReviewModal from "../../components/LectureInfo/AddReviewModal";
import AddQnaModal from "../../components/LectureInfo/AddQnaModal";
import { postQna, getLectureQnas } from "../../api/Qna/qnaAPI";
import {
  getReviewRequest,
  postReviewRequest,
} from "../../api/Review/reviewAPI";
import type { Review } from "../../types/review";
import ReviewCard from "../../components/LectureInfo/ReviewCard";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Common/Button";
import QuestionCard from "../../components/Qna/QuestionCard";
import type { Qna } from "../../types/qna";
import { getLectureById } from "../../api/LectureInfo/lectureInfoAPI";
import { checkLecturePurchased } from "../../api/LectureInfo/lectureInfoAPI";

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
  const isAuthenticated = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );

  // 구매 여부
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const progress: number = 70;
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<Lecture | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("curriculum");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qnaList, setQnaList] = useState<Qna[]>([]);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isAddQnaModalOpen, setIsAddQnaModalOpen] = useState(false);
  const lessons = Array.from({ length: 10 }).map((_, i) => ({
    title: `레슨 ${i + 1}: 제목`,
    duration: "23분",
  }));

  useEffect(() => {
    if (!lectureId) return;

    const fetchLecture = async () => {
      try {
        const data = await getLectureById(lectureId);
        setLecture(data);
        console.log(data);

        const purchased = await checkLecturePurchased(data);
        setIsPurchased(purchased);
      } catch (err) {
        console.error("Failed to fetch lecture", err);
      }
    };

    fetchLecture();
  }, [lectureId]);

  useEffect(() => {
    if (lecture?.lectureId) {
      const fetchQnaList = async () => {
        if (lecture && lecture.lectureId) {
          try {
            const data = await getLectureQnas(lecture.lectureId);
            setQnaList(data);
          } catch (err) {
            console.error(err);
          }
        }
      };

      const fetchReviews = async () => {
        if (lecture && lecture.lectureId) {
          try {
            const data = await getReviewRequest(lecture.lectureId);
            setReviews(data);
          } catch (err) {
            console.error(err);
          }
        }
      };

      fetchQnaList();
      fetchReviews();
    }
  }, [lecture]);

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
                <RatingNumber>{lecture?.averageStar ?? 0}</RatingNumber>
                <StarRow>
                  {Array.from({
                    length: Math.floor(lecture?.averageStar ?? 0),
                  }).map((_, idx) => (
                    <Star key={idx}>★</Star>
                  ))}
                  {(lecture?.averageStar ?? 0) % 1 !== 0 && <Star>☆</Star>}
                </StarRow>
                <ReviewCount>{lecture?.reviewCount}개의 리뷰</ReviewCount>
                {isAuthenticated && isPurchased && (
                  <Button
                    text="리뷰 등록"
                    onClick={() => setIsAddReviewModalOpen(true)}
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
          {activeTab === "qna" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {qnaList.map((qna) => (
                <QuestionCard key={qna.id} qna={qna} />
              ))}
            </div>
          )}
        </RightPane>
      </Content>

      <AddReviewModal
        visible={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        onSubmit={async (data) => {
          try {
            if (lecture == null) return;
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
        lectureId={lecture?.lectureId}
        onSubmit={async (data) => {
          try {
            await postQna(data);
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
