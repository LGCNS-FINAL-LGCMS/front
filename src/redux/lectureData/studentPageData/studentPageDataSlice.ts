import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../../api/index";
import { API_ENDPOINTS } from "../../../constants/endpoints";
import type { RootState } from "../../store";
import type { Lecture as LectureType } from "../../../types/lecture";

interface PaginationState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lectureList: LectureType[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

const initialState: PaginationState = {
  status: "idle",
  error: null,
  lectureList: [],
  totalCount: 0,
  currentPage: 0,
  pageSize: 12,
};

interface FetchParams {
  page: number;
  size: number;
}

export const fetchStudentLecturePage = createAsyncThunk<
  { content: LectureType[]; totalElements: number },
  FetchParams,
  { rejectValue: string; state: RootState }
>("studentPagination/fetch", async (params, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_LECTURE, {
      params,
    });

    if (response.data?.status === "OK") {
      const { content, totalElements } = response.data.data;

      const lectures: LectureType[] = content.map((item: LectureType) => ({
        lectureId: item.lectureId,
        nickname: item.nickname || "",
        description: item.description || "",
        title: item.title || "",
        price: item.price,
        progress: item.progress || 0,
        thumbnail: item.thumbnail,
        averageStar: item.averageStar,
        reviewCount: item.reviewCount,
        information: item.information,
      }));

      return { content: lectures, totalElements };
    } else {
      throw new Error(
        response.data.message || "강의 데이터를 불러오지 못했습니다."
      );
    }
  } catch {
    return rejectWithValue("강의 데이터 요청 실패");
  }
});

const studentLecturePagenationSlice = createSlice({
  name: "student_LectureData",
  initialState,
  reducers: {
    resetPaginationState: (state) => {
      state.status = "idle";
      state.error = null;
      state.lectureList = [];
      state.totalCount = 0;
      state.currentPage = 0;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentLecturePage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchStudentLecturePage.fulfilled,
        (
          state,
          action: PayloadAction<{
            content: LectureType[];
            totalElements: number;
          }>
        ) => {
          state.status = "succeeded";
          state.lectureList = action.payload.content;
          state.totalCount = action.payload.totalElements || 0;
        }
      )
      .addCase(fetchStudentLecturePage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "강의 데이터를 불러오는 중 오류 발생";
      });
  },
});

export const { resetPaginationState, setCurrentPage } =
  studentLecturePagenationSlice.actions;

export default studentLecturePagenationSlice.reducer;
