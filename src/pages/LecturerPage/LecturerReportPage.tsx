import styled, { keyframes } from "styled-components";
import { getLecturerReportData } from "../../utils/sessionStorage/consulting";
import type { LecturerReport } from "../../utils/sessionStorage/consulting";
import { useEffect, useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.font.primary};
  font-size: ${({ theme }) => theme.fontSize.title.max};
  border-color: ${({ theme }) => theme.colors.gray_M};
  max-width: 100%;
  padding-bottom: 12px;
  border-bottom: 2px solid;
  width: ${({ theme }) => theme.size.bottomLine};
`;

const LecturerReportContainer = styled.div`
  margin-top: 30px;
  margin: 0 auto;
`;
const LecturerReportTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.title.min};
`;
const LecturerReportCard = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  font-size: ${({ theme }) => theme.fontSize.contents.medium};
  width: ${({ theme }) => theme.size.bottomLine};
  margin-top: 20px;
  border-radius: 16px;
  padding: 22px 24px;
  white-space: pre-wrap;
`;
const NotFoundMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.caution};
  text-align: center;
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonCard = styled.div`
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  height: ${({ height }) => height || "16px"};
  width: ${({ width }) => width || "100%"};
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkeletonTitle = styled.div`
  height: 32px;
  width: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 24px;
`;

const LecturerReportPage = () => {
  const [lecturerReport, setLecturerReport] = useState<LecturerReport>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await getLecturerReportData();
        if (result) {
          setLecturerReport(result);
        } else {
          setHasError(true);
          console.log("강사 레포트 데이터를 불러올 수 없습니다.");
        }
      } catch (error) {
        setHasError(true);
        console.error("강사 레포트 데이터 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  if (isLoading) {
    return (
      <LecturerReportContainer>
        <SkeletonTitle />
        <SkeletonCard>
          <SkeletonLine width="90%" />
          <SkeletonLine width="75%" />
          <SkeletonLine width="85%" />
          <SkeletonLine width="60%" />
          <SkeletonLine width="80%" />
        </SkeletonCard>
        <SkeletonCard>
          <SkeletonLine width="85%" />
          <SkeletonLine width="70%" />
          <SkeletonLine width="90%" />
          <SkeletonLine width="65%" />
        </SkeletonCard>
        <SkeletonCard>
          <SkeletonLine width="80%" />
          <SkeletonLine width="85%" />
          <SkeletonLine width="70%" />
          <SkeletonLine width="90%" />
          <SkeletonLine width="75%" />
        </SkeletonCard>
      </LecturerReportContainer>
    );
  }

  if (hasError || !lecturerReport) {
    return (
      <Container>
        <PageTitle>강사 레포트</PageTitle>
        <LecturerReportContainer>
          <NotFoundMessage>조회된 강사 레포트가 없습니다.</NotFoundMessage>
        </LecturerReportContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>강사 레포트</PageTitle>
      <LecturerReportContainer>
        <LecturerReportCard>
          <LecturerReportTitle>리뷰 분석</LecturerReportTitle>
          {lecturerReport.reviewAnalysisResult}
        </LecturerReportCard>
        <LecturerReportCard>
          <LecturerReportTitle>질문 분석</LecturerReportTitle>
          {lecturerReport.qnaAnalysisResult}
        </LecturerReportCard>
        <LecturerReportCard>
          <LecturerReportTitle>종합 피드백</LecturerReportTitle>
          {lecturerReport.overallAnalysisResult}
        </LecturerReportCard>
      </LecturerReportContainer>
    </Container>
  );
};

export default LecturerReportPage;
