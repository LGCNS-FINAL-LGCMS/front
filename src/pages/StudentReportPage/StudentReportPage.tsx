import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import type { AppDispatch, RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchStudentReport } from "../../redux/StudentReport/StudentReportSlice";

const StudentReportWrapper = styled.div``;

const Title = styled.p`
  border-bottom: 2px solid;
  width: 1080px;
  font-size: ${(props) => props.theme.fontSize.title.max};
  font-family: ${(props) => props.theme.font.primary};
  border-color: ${(props) => props.theme.colors.border_Dark};
  margin: 0 auto 30px auto; /* 👈 좌우 auto로 가운데 정렬! */
`;

const ReportWrapper = styled.div``;

const StudentReportPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reportId } = useParams<{ reportId: string }>();

  const reportData = useSelector((state: RootState) => state.studentReport);
  useEffect(() => {
    if (reportId) {
      const numericReportId = Number(reportId);
      dispatch(fetchStudentReport(numericReportId));
    }
  }, [reportId, dispatch]);
  return (
    <StudentReportWrapper>
      <Title>LevelTest Report</Title>
      <ReportWrapper>{reportData.comprehensiveFeedback}</ReportWrapper>
    </StudentReportWrapper>
  );
};

export default StudentReportPage;
