import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { getDashboardData } from "../../utils/sessionStorage/consulting";
import type {
  DashboardData,
  MonthlyStatusResponse,
  BarChartData,
  ProfitDistribution,
  CompleteProgress,
  ProgressGroup,
  StudentLectureCountResponse,
  LineChartData,
} from "../../utils/sessionStorage/consulting";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DashboardTitle = styled.p`
  border-bottom: 2px solid;
  width: 1080px;
  font-size: ${(props) => props.theme.fontSize.title.max};
  font-family: ${(props) => props.theme.font.primary};
  border-color: ${(props) => props.theme.colors.border_Dark};
  margin: 0 auto 30px auto;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 400px;
  gap: 20px;
  margin-bottom: 30px;
  width: ${({ theme }) => theme.size.bottomLine};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-auto-rows: 400px;
  }
`;

const ChartCard = styled.div<{ $span?: "col" | "row" | "both" }>`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.md};

  ${({ $span }) => {
    switch ($span) {
      case "col":
        return "grid-column: span 2;";
      case "row":
        return "grid-row: span 2;";
      case "both":
        return "grid-column: span 2; grid-row: span 2;";
      default:
        return "";
    }
  }}

  @media (max-width: 1024px) {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_D};
  margin-bottom: 15px;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: calc(100% - 50px);
`;

const NotFoundMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.caution};
  text-align: center;
`;

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: ${({ theme }) => theme.fontSize.contents.medium};
  color: ${({ theme }) => theme.colors.text_D};
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

const LecturerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getDashboardData();
        if (result) {
          setDashboardData(result);
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
      <DashboardContainer>
        <DashboardTitle>강사 대시보드</DashboardTitle>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingMessage>
            대시보드 데이터를 불러오는 중입니다...
          </LoadingMessage>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (hasError || !dashboardData) {
    return (
      <DashboardContainer>
        <DashboardTitle>강사 대시보드</DashboardTitle>
        <NotFoundMessage>조회된 대시보드 데이터가 없습니다.</NotFoundMessage>
      </DashboardContainer>
    );
  }

  const monthlyStatusData: MonthlyStatusResponse =
    dashboardData?.monthlyStatusResponse;

  const profitDistributionData: BarChartData<ProfitDistribution> =
    dashboardData.profitDistributionResponse;

  const profitOverviewData: LineChartData =
    dashboardData.profitOverviewResponse;

  const completeProgressData: BarChartData<CompleteProgress> =
    dashboardData.completeProgressResponse;

  const progressGroupData: BarChartData<ProgressGroup> =
    dashboardData.progressGroupResponse;

  const studentLectureCountData: StudentLectureCountResponse =
    dashboardData.studentLectureCountResponse;

  return (
    <DashboardContainer>
      <DashboardTitle>강사 대시보드</DashboardTitle>
      <ChartsGrid>
        <ChartCard>
          <ChartTitle>이번 달 현황</ChartTitle>
          <ChartContainer>
            {!monthlyStatusData?.monthlyStatus ||
            monthlyStatusData.monthlyStatus.length === 0 ? (
              <NoDataMessage>조회된 데이터가 없습니다.</NoDataMessage>
            ) : (
              <ResponsivePie
                data={monthlyStatusData.monthlyStatus}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                enableArcLabels={false}
                colors={{ scheme: "set3" }}
                borderWidth={1}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                  },
                ]}
              />
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>강의 수익 분포</ChartTitle>
          <ChartContainer>
            {!profitDistributionData?.dataList ||
            profitDistributionData.dataList.length === 0 ? (
              <NoDataMessage>조회된 데이터가 없습니다.</NoDataMessage>
            ) : (
              <ResponsiveBar
                data={profitDistributionData.dataList}
                keys={profitDistributionData.keyList}
                indexBy={profitDistributionData.index}
                enableLabel={false}
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "set2" }}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                  },
                ]}
              />
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard $span="col">
          <ChartTitle>수익 종합 차트</ChartTitle>
          <ChartContainer>
            {!profitOverviewData?.data ||
            profitOverviewData.data.length === 0 ? (
              <NoDataMessage>조회된 데이터가 없습니다.</NoDataMessage>
            ) : (
              <ResponsiveLine
                data={[profitOverviewData]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                curve="catmullRom"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  tickValues: 10,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  format: (value) => `${(value / 1000000).toFixed(0)}M`,
                }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                colors={{ scheme: "category10" }}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                  },
                ]}
              />
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>강의 완강율</ChartTitle>
          <ChartContainer>
            {!completeProgressData?.dataList ||
            completeProgressData.dataList.length === 0 ? (
              <NoDataMessage>조회된 데이터가 없습니다.</NoDataMessage>
            ) : (
              <ResponsiveBar
                data={completeProgressData.dataList}
                keys={completeProgressData.keyList}
                indexBy={completeProgressData.index}
                enableLabel={false}
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "pastel1" }}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  tickSize: 3,
                  tickPadding: 3,
                  tickRotation: 0,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                layout="horizontal"
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                  },
                ]}
              />
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>수강생당 결제한 내 강의 수</ChartTitle>
          <ChartContainer>
            {!studentLectureCountData?.data ||
            studentLectureCountData.data.length === 0 ? (
              <NoDataMessage>조회된 데이터가 없습니다.</NoDataMessage>
            ) : (
              <ResponsivePie
                data={studentLectureCountData.data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                enableArcLabels={false}
                colors={{ scheme: "nivo" }}
                borderWidth={1}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                  },
                ]}
              />
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard $span="col">
          <ChartTitle>수강율 구간별 학생수</ChartTitle>
          <ChartContainer>
            {!progressGroupData?.dataList ||
            progressGroupData.dataList.length === 0 ? (
              <NoDataMessage>조회된 데이터가 없습니다.</NoDataMessage>
            ) : (
              <ResponsiveBar
                data={progressGroupData.dataList}
                keys={progressGroupData.keyList}
                indexBy={progressGroupData.index}
                enableLabel={false}
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "set3" }}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                  },
                ]}
              />
            )}
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>
    </DashboardContainer>
  );
};

export default LecturerDashboardPage;
