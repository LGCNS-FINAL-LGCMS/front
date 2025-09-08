import apiClient from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";

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

export interface LecturerReport {
  reviewAnalysisResult: string;
  qnaAnalysisResult: string;
  overallAnalysisResult: string;
}

export const getLecturerReportData = async () => {
  try {
    const sessionData = getLecturerReportFromSession();
    if (sessionData) return sessionData;

    const response = await apiClient.post(
      API_ENDPOINTS.CONSULTING.GET_LECTURER_REPORT
    );

    const lecturerReport: LecturerReport = {
      reviewAnalysisResult: response.data.data.reviewAnalysisResult,
      qnaAnalysisResult: response.data.data.qnaAnalysisResult,
      overallAnalysisResult: response.data.data.overallAnalysisResult,
    };

    sessionStorage.setItem("lecturerReport", JSON.stringify(lecturerReport));
    return getLecturerReportFromSession();
  } catch {
    return null;
  }
};

export const getDashboardData = async () => {
  try {
    const sessionData = getDashboardFromSession();
    if (sessionData) return sessionData;

    const response = await apiClient.get(
      API_ENDPOINTS.CONSULTING.GET_DASHBOARD
    );

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
  } catch {
    return null;
  }
};

export const getDashboardFromSession = () => {
  try {
    const data = sessionStorage.getItem("lecturerDashboard");
    return data ? JSON.parse(data) : null;
  } catch {
    sessionStorage.removeItem("lecturerDashboard");
    return null;
  }
};

const getLecturerReportFromSession = () => {
  try {
    const data = sessionStorage.getItem("lecturerReport");
    return data ? JSON.parse(data) : null;
  } catch {
    sessionStorage.removeItem("lecturerReport");
    return null;
  }
};
