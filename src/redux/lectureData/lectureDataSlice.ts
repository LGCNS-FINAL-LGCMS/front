import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import apiClient from "../../api/index";

// 강의 항목 타입 (임시, 수정 가능)
interface Lecture {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  lecturer?: string;
  // 필요에 따라 추가
}

// 초기 상태 타입
interface LectureDataState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lectureList: Lecture[];
  totalCount: number;
  hasMore: boolean;
}

const initialState: LectureDataState = {
  status: "idle",
  error: null,
  lectureList: [],
  totalCount: 0,
  hasMore: true,
};

// 비동기 thunk
export const fetchLectureData = createAsyncThunk<
  { content: Lecture[]; totalElements: number },
  any,
  { rejectValue: string; state: any }
>("lectureData/fetch", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/lecture/list", { params: payload });

    if (response.data?.code === "OK") {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "강의 데이터를 불러오지 못했습니다."
      );
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "강의 데이터 요청 실패";
    return rejectWithValue(message);
  }
});

const lectureDataSlice = createSlice({
  name: "lectureData",
  initialState,
  reducers: {
    resetLectureDataState: (state) => {
      state.status = "idle";
      state.error = null;
      state.lectureList = [];
      state.totalCount = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectureData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchLectureData.fulfilled,
        (
          state,
          action: PayloadAction<{ content: Lecture[]; totalElements: number }>
        ) => {
          state.status = "succeeded";
          const { content, totalElements } = action.payload;

          state.lectureList = [...state.lectureList, ...(content || [])];
          state.totalCount = totalElements || 0;
          state.hasMore = totalElements > state.lectureList.length;
          state.error = null;
        }
      )
      .addCase(fetchLectureData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "강의 데이터를 불러오는 중 오류 발생";
      });
  },
});

export const { resetLectureDataState } = lectureDataSlice.actions;

export default lectureDataSlice.reducer;
