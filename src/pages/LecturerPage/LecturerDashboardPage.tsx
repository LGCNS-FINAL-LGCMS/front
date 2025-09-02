import { useEffect, useState } from "react";
import styled from "styled-components";
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
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background_B};
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height});
  font-family: ${({ theme }) => theme.font.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DashboardTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_D};
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border_Dark};
  width: ${({ theme }) => theme.size.bottomLine};
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

const LecturerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getDashboardData();
        if (result) {
          setDashboardData(result);
        } else {
          console.log("강사 대시보드 데이터를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("강사 대시보드 데이터 불러오기 실패:", error);
      }
    };
    getData();
  }, []);

  if (!dashboardData) {
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
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>강의 수익 분포</ChartTitle>
          <ChartContainer>
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
          </ChartContainer>
        </ChartCard>

        <ChartCard $span="col">
          <ChartTitle>수익 종합 차트</ChartTitle>
          <ChartContainer>
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
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>강의 완강율</ChartTitle>
          <ChartContainer>
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
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>수강생당 결제한 내 강의 수</ChartTitle>
          <ChartContainer>
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
          </ChartContainer>
        </ChartCard>

        <ChartCard $span="col">
          <ChartTitle>수강율 구간별 학생수</ChartTitle>
          <ChartContainer>
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
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>
    </DashboardContainer>
  );
};

export default LecturerDashboardPage;
