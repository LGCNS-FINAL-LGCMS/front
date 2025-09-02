import apiClient from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";

export interface DashboardData {
  monthlyStatusResponse: MonthlyStatusResponse;
  profitDistributionResponse: BarChartData<ProfitDistribution>;
  profitOverviewResponse: LineChartData;
  completeProgressResponse: BarChartData<CompleteProgress>;
  progressGroupResponse: BarChartData<ProgressGroup>;
  studentLectureCountResponse: StudentLectureCountResponse;
}

export interface MonthlyStatusResponse {
  total: number;
  monthlyStatus: PieChartData[];
}

export interface BarChartData<T> {
  index: string;
  keyList: string[];
  dataList: T[];
}

export interface ProfitDistribution {
  day: string;
  [key: string]: string | number;
}

export interface CompleteProgress {
  title: string;
  [key: string]: string | number;
}

export interface ProgressGroup {
  rateGroup: string;
  [key: string]: string | number;
}

export interface StudentLectureCountResponse {
  data: PieChartData[];
}

export interface PieChartData {
  id: string;
  value: number;
}

export interface LineChartData {
  id: string;
  data: {
    x: string;
    y: string | number;
  }[];
}

export const getDashboardData = async () => {
  try {
    const sessionData = getDashboardFromSession();
    if (sessionData) return sessionData;

    const response = await apiClient.get(
      API_ENDPOINTS.CONSULTING.GET_DASHBOARD
    );
    console.log("Response:", response);

    const dashboardData: DashboardData = {
      monthlyStatusResponse: response.data.data.monthlyStatusResponse,
      profitDistributionResponse: response.data.data.profitDistributionResponse,
      profitOverviewResponse: response.data.data.profitOverviewResponse,
      completeProgressResponse: response.data.data.completeProgressResponse,
      progressGroupResponse: response.data.data.progressGroupResponse,
      studentLectureCountResponse:
        response.data.data.studentLectureCountResponse,
    };

    sessionStorage.setItem("lecturerDashboard", JSON.stringify(dashboardData));
    return getDashboardFromSession();
  } catch (error: unknown) {
    const message = getErrorMessage(error, "강사 대시보드 조회 실패");
    console.error("Consulting Dashboard error:", message);
    throw new Error(message);
  }
};

export const getDashboardFromSession = () => {
  try {
    const data = sessionStorage.getItem("lecturerDashboard");
    return data ? JSON.parse(data) : null;
  } catch (error: unknown) {
    console.log("세션데이터를 가져오지 못했습니다.", error);
    sessionStorage.removeItem("lecturerDashboard");
    return null;
  }
};
