import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import type { AppDispatch, RootState } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchStudentReport } from "../../redux/StudentReport/StudentReportSlice";

import blueStar from "../../assets/images/levelTestPage/blueStar.svg";
import blueStar_empty from "../../assets/images/levelTestPage/blueStar_empty.svg";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PAGE_PATHS } from "../../constants/pagePaths";

const Container = styled.div`
  display: flex;
  align-items: flex-start;
`;

const StudentReportWrapper = styled.div`
  font-family: ${(props) => props.theme.font.primary};
  max-width: ${(props) => props.theme.size.containerMax};
  min-width: ${(props) => props.theme.size.container_S};

  background-color: white;
  border-radius: 11px;
  margin: 10px;
  padding: 80px;
  border: 2px solid ${(props) => props.theme.colors.gray_M};
`;

const BackButtion = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: -70px;
  left: -50px;
  margin-top: 20px;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  background-color: white;
  color: ${({ theme }) => theme.colors.border_Dark};
  cursor: pointer;
  padding: 0;

  &:hover {
    transform: ${(props) => props.theme.transition.slow};
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const ReportHeader = styled.div`
  position: relative;
  margin-bottom: 20px;
  align-items: center;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  border-bottom: 2px solid;
  max-width: 100%;
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-family: ${({ theme }) => theme.font.primary};
  border-color: ${({ theme }) => theme.colors.background_Overlay};
  color: ${({ theme }) => theme.colors.text_D};
  padding-bottom: 12px;
`;

const Category = styled.div`
  position: absolute;
  top: -10px;
  right: 32px;

  background: white;
  border: 1px solid ${(props) => props.theme.colors.border_Light};
  border-radius: 20px;
  padding: 3px 20px;

  font-size: ${(props) => props.theme.fontSize.body.max};
  color: ${(props) => props.theme.colors.border_Dark};
  white-space: nowrap;
  box-shadow: ${(props) => props.theme.shadow.lg};
`;
const ReportWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: left;
  font-family: ${(props) => props.theme.font.primary};
  margin: 10px;
`;

const ReportContainer = styled.div`
  margin: 10px;
`;

const ScoreContainer = styled.section`
  border-radius: 8px;
  margin: 10px auto;
  border: 2px solid ${(props) => props.theme.colors.card};
  background: white;
  width: 80%;
  max-height: 15%;
  box-shadow: ${(props) => props.theme.shadow.lg};
`;

const ScoreTitle = styled.p`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const TotalScore = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSize.subtitle};
  margin-bottom: 20px;
`;

const SummarySection = styled.section`
  padding: 20px 0;
  margin-top: 30px;
`;

const SummaryTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.title.min};
  margin: 0 20px;
`;

const SummaryContainer = styled.div`
  display: grid;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
  width: 97%;
`;
const SummaryCard = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.card};
  box-shadow: ${(props) => props.theme.shadow.lg};
  border-radius: 16px;
  padding: 15px 20px;
  transition: ${(props) => props.theme.transition.default};

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SummaryData = styled.div``;

const ConceptName = styled.p`
  font-size: ${(props) => props.theme.fontSize.subtitle};
  margin: 10px;
  width: 100%;
  height: 30%;
  margin: 0 auto;
`;
const SummaryScore = styled.section`
  margin: 10px;
  width: 100%;
  height: 30%;
  margin: 0 auto;
`;
const SummaryScoreIcon = styled.img`
  width: 16px;
  height: 16px;
`;
const SummaryComment = styled.p`
  font-size: ${(props) => props.theme.fontSize.body.max};
  margin: 10px;
  width: 100%;
  height: 30%;
  margin: 0 auto;
`;

const EmptySummaryMessage = styled.p`
  min-width: 30%;

  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.card};
  box-shadow: ${(props) => props.theme.shadow.lg};
  font-size: ${(props) => props.theme.fontSize.contents.medium};

  margin-top: 20px;
  border-radius: 16px;
  padding: 22px 24px;
`;

const FeedbackContainer = styled.div`
  margin-top: 30px;
  margin: 0 auto;
  width: 97%;
`;

const FeedbackTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.title.min};
`;

const FeedbackCard = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.card};
  box-shadow: ${(props) => props.theme.shadow.lg};
  font-size: ${(props) => props.theme.fontSize.contents.medium};

  margin-top: 20px;
  border-radius: 16px;
  padding: 22px 24px;
`;

const NextStepsContainer = styled.div`
  margin-top: 30px;
  margin: 0 auto;
  width: 97%;
`;

const NextStepsTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.title.min};
`;

const NextStepsCard = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.card};
  box-shadow: ${(props) => props.theme.shadow.lg};
  font-size: ${(props) => props.theme.fontSize.contents.medium};
  margin-top: 20px;
  border-radius: 16px;
  padding: 22px 24px;
`;

const StudentReportPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();

  const reportData = useSelector((state: RootState) => state.studentReport);
  useEffect(() => {
    if (reportId) {
      const numericReportId = Number(reportId);
      dispatch(fetchStudentReport(numericReportId));
    }
  }, [reportId, dispatch]);

  return (
    <Container>
      <StudentReportWrapper>
        <ReportHeader>
          <BackButtion
            onClick={() => {
              navigate(PAGE_PATHS.LEVEL_TEST.DASHBOARD);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
          </BackButtion>
          <PageTitle>LevelTest Report</PageTitle>
          <Category>{reportData.category}</Category>
        </ReportHeader>

        <ReportWrapper>
          <ReportContainer>
            <ScoreContainer>
              <ScoreTitle>Total Score</ScoreTitle>
              <TotalScore>
                <span
                  style={{
                    color: "#005d9fff",
                    fontWeight: "bold",
                    fontSize: "48px",
                  }}
                >
                  {reportData.totalScore}
                </span>
                /100
              </TotalScore>
            </ScoreContainer>
            <SummarySection>
              <SummaryTitle>개념별 이해도 요약</SummaryTitle>
              <SummaryContainer>
                {reportData.conceptSummaries.length > 0 ? (
                  reportData.conceptSummaries.map((conceptSummary) => (
                    <SummaryCard key={conceptSummary.conceptName}>
                      <SummaryData>
                        <ConceptName>{conceptSummary.conceptName}</ConceptName>
                        <SummaryScore>
                          {conceptSummary.score &&
                            [...Array(5)].map((_, idx) => (
                              <SummaryScoreIcon
                                key={idx}
                                src={
                                  idx < conceptSummary.score
                                    ? blueStar
                                    : blueStar_empty
                                }
                                alt="점수"
                              />
                            ))}
                        </SummaryScore>
                        <SummaryComment>
                          {conceptSummary.comment}
                        </SummaryComment>
                      </SummaryData>
                    </SummaryCard>
                  ))
                ) : (
                  <EmptySummaryMessage>데이터가 없습니다.</EmptySummaryMessage>
                )}
              </SummaryContainer>
            </SummarySection>
            <FeedbackContainer>
              <FeedbackCard>
                <FeedbackTitle>종합 피드백</FeedbackTitle>
                {reportData.comprehensiveFeedback}
              </FeedbackCard>
            </FeedbackContainer>
            <NextStepsContainer>
              <NextStepsCard>
                <NextStepsTitle>다음 추천 학습</NextStepsTitle>
                {reportData.nextLearningRecommendation}
              </NextStepsCard>
            </NextStepsContainer>
          </ReportContainer>
        </ReportWrapper>
      </StudentReportWrapper>
    </Container>
  );
};

export default StudentReportPage;
