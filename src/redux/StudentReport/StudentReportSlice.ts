import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import apiClient from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";

export interface StudentReportApiResponse {
  status: "OK" | "ERROR";
  message: string;
  data: StudentReportData;
}

export interface StudentReportData {
  reportId: number;
  memberId: number;
  totalScore: number;
  totalQuestions: number;
  studentLevel: "LOW" | "MEDIUM" | "HIGH";
  conceptSummaries: ConceptSummary[];
  comprehensiveFeedback: string;
  nextLearningRecommendation: string;
  createdAt: string;
  category: string;
}

export interface ConceptSummary {
  conceptName: string;
  score: number;
  comment: string;
}

const initialState: StudentReportData = {
  reportId: -1,
  memberId: -1,
  totalScore: 0,
  totalQuestions: 0,
  studentLevel: "MEDIUM",
  conceptSummaries: [],
  comprehensiveFeedback: "",
  nextLearningRecommendation: "",
  createdAt: "",
  category: "",
};

export const fetchStudentReport = createAsyncThunk<
  StudentReportData,
  number,
  { rejectValue: string; state: RootState }
>("studentReport/fetchReport", async (reportId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.STUDENT_REPORT.GET}/${reportId}`
    );

    if (response.data?.status === "OK") {
      const reportData = response.data.data;
      localStorage.setItem("studentReport", JSON.stringify(reportData));
      return reportData;
    } else {
      throw new Error(
        response.data.message || "학습 보고서를 불러오지 못했습니다."
      );
    }
  } catch {
    return rejectWithValue("학습 보고서 요청 실패");
  }
});

export const studentReportSlice = createSlice({
  name: "studentReport",
  initialState,
  reducers: {
    setStudentReportData: (state, action: PayloadAction<StudentReportData>) => {
      state.reportId = action.payload.reportId;
      state.memberId = action.payload.memberId;
      state.totalScore = action.payload.totalScore;
      state.totalQuestions = action.payload.totalQuestions;
      state.studentLevel = action.payload.studentLevel;
      state.conceptSummaries = action.payload.conceptSummaries;
      state.comprehensiveFeedback = action.payload.comprehensiveFeedback;
      state.nextLearningRecommendation =
        action.payload.nextLearningRecommendation;
      state.createdAt = action.payload.createdAt;
      state.category = action.payload.category;

      localStorage.setItem("studentReport", JSON.stringify(action.payload));
    },
    resetStudentReportData: (state) => {
      state.reportId = -1;
      state.memberId = -1;
      state.totalScore = 0;
      state.totalQuestions = 0;
      state.studentLevel = "MEDIUM";
      state.conceptSummaries = [];
      state.comprehensiveFeedback = "";
      state.nextLearningRecommendation = "";
      state.createdAt = "";
      state.category = "";

      localStorage.removeItem("studentReport");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentReport.fulfilled, (state, action) => {
        state.reportId = action.payload.reportId;
        state.memberId = action.payload.memberId;
        state.totalScore = action.payload.totalScore;
        state.totalQuestions = action.payload.totalQuestions;
        state.studentLevel = action.payload.studentLevel;
        state.conceptSummaries = action.payload.conceptSummaries;
        state.comprehensiveFeedback = action.payload.comprehensiveFeedback;
        state.nextLearningRecommendation =
          action.payload.nextLearningRecommendation;
        state.createdAt = action.payload.createdAt;
        state.category = action.payload.category;
      })
      .addCase(fetchStudentReport.rejected, (state, action) => {
        console.log("학생 Report API 호출 실패", action.payload);
        // api호출 실패 시 state를 초기값으로 리셋
        state.reportId = -1;
        state.memberId = -1;
        state.totalScore = 0;
        state.totalQuestions = 0;
        state.studentLevel = "MEDIUM";
        state.conceptSummaries = [];
        state.comprehensiveFeedback = "";
        state.nextLearningRecommendation = "";
        state.createdAt = "";
        state.category = "";
      });
  },
});

export const { setStudentReportData, resetStudentReportData } =
  studentReportSlice.actions;

export default studentReportSlice.reducer;
