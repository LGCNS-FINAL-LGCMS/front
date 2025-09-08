import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
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
import {
  getLectureById,
  type LectureData,
  type LessonResponse,
} from "../../api/LectureInfo/lectureInfoAPI";

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

const LectureInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: ${({ theme }) => theme.colors.background_B};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.1rem;
`;

const SectionContent = styled.div`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.text_D};
  line-height: 1.6;
  white-space: pre-line;
`;

type TabType = "curriculum" | "reviews" | "qna";

const LectureInfoPage = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );

  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<LectureData | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("curriculum");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qnaList, setQnaList] = useState<Qna[]>([]);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isAddQnaModalOpen, setIsAddQnaModalOpen] = useState(false);
  const [lessonList, setLessonList] = useState<LessonResponse[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const fetchQnaList = useCallback(async () => {
    if (lecture && lecture.lectureResponseDto?.lectureId) {
      try {
        const data = await getLectureQnas(lecture.lectureResponseDto.lectureId);
        setQnaList(data);
      } catch (err) {
        console.error(err);
      }
    }
  }, [lecture]);

  const fetchReviews = useCallback(async () => {
    if (lecture?.lectureResponseDto?.lectureId) {
      try {
        const data = await getReviewRequest(
          lecture.lectureResponseDto.lectureId
        );
        setReviews(data.data.content);
      } catch (err) {
        console.error(err);
      }
    }
  }, [lecture]);

  const fetchLectureData = async () => {
    if (!lectureId) return;
    try {
      const data = await getLectureById(lectureId);
      setLecture(data);
      setLessonList(data.lessonResponses);
      setProgress(data?.progress ?? 0);
    } catch (err) {
      console.error("Failed to fetch lecture data", err);
    }
  };

  useEffect(() => {
    fetchLectureData();
  }, [lectureId]);

  useEffect(() => {
    if (!lecture?.lectureResponseDto?.lectureId) return;

    fetchQnaList();
    fetchReviews();
  }, [lecture]);

  return (
    <Wrapper>
      <LectureInfoHeader
        lecture={lecture?.lectureResponseDto}
        purchased={lecture?.isStudent}
        progress={progress}
        hasLessons={lessonList.length > 0}
      />

      <LectureInfoTabMenu
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewCount={lecture?.lectureResponseDto.reviewCount ?? 0}
      />

      <Content>
        <LeftPane>
          {activeTab === "curriculum" && (
            <CurriculumList lessons={lessonList} />
          )}
          {activeTab === "reviews" && (
            <>
              <ReviewWrapper>
                <RatingNumber>
                  {(lecture?.lectureResponseDto.averageStar ?? 0).toFixed(1)}
                </RatingNumber>
                <StarRow>
                  {Array.from({
                    length: Math.floor(
                      lecture?.lectureResponseDto.averageStar ?? 0
                    ),
                  }).map((_, idx) => (
                    <Star key={idx}>★</Star>
                  ))}
                  {(lecture?.lectureResponseDto.averageStar ?? 0) % 1 !== 0 && (
                    <Star>☆</Star>
                  )}
                </StarRow>
                <ReviewCount>
                  {lecture?.lectureResponseDto.reviewCount ?? 0}개의 리뷰
                </ReviewCount>
                {isAuthenticated && lecture?.isStudent && (
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
          {activeTab === "curriculum" && (
            <LectureInfoContent>
              <SectionTitle>강의 상세 설명</SectionTitle>
              <SectionContent>
                {lecture?.lectureResponseDto.information ||
                  "강의 상세 정보가 없습니다."}
              </SectionContent>
            </LectureInfoContent>
          )}
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
            await postReviewRequest(lecture.lectureResponseDto.lectureId, data);
            await fetchReviews();
            await fetchLectureData();
            setIsAddReviewModalOpen(false);
          } catch (err) {
            console.error(err);
            alert("리뷰 등록 실패");
          }
        }}
        questions={[
          { question: "이번 강의가 도움이 되었나요?" },
          { question: "강의 난이도는 괜찮았나요?" },
        ]}
      />

      <AddQnaModal
        visible={isAddQnaModalOpen}
        onClose={() => setIsAddQnaModalOpen(false)}
        lectureId={lecture?.lectureResponseDto?.lectureId}
        onSubmit={async (data) => {
          try {
            await postQna(data);
            fetchQnaList();
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
