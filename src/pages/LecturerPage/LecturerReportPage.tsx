import styled, { keyframes } from "styled-components";
import { getLecturerReportData } from "../../utils/sessionStorage/consulting";
import type { LecturerReport } from "../../utils/sessionStorage/consulting";
import { useEffect, useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height});
  font-family: ${({ theme }) => theme.font.primary};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  color: ${({ theme }) => theme.colors.text_D};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border_Dark};
  padding: 10px 0;
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  color: ${({ theme }) => theme.colors.gray_D};
  font-weight: 500;
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
        }
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <PageTitle>강사 레포트</PageTitle>
        <LecturerReportContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingMessage>강사 레포트를 생성중입니다...</LoadingMessage>
          </LoadingContainer>
        </LecturerReportContainer>
      </Container>
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
