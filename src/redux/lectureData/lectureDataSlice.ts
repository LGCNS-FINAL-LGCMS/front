import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../constants/endpoints";
import apiClient from "../../api/index";
import type { Lecture as LectureType } from "../../types/lecture";
import type { RootState } from "../../redux/store";

interface LectureDataState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lectureList: LectureType[];
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

interface FetchLectureParams {
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
}

// 비동기 thunk
export const fetchLectureData = createAsyncThunk<
  { content: LectureType[]; totalElements: number },
  FetchLectureParams,
  { rejectValue: string; state: RootState }
>("lectureData/fetch", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.LECTURE.GET, {
      params: payload,
    });

    if (response.data?.status === "OK") {
      const { content, totalElements } = response.data.data;

      // 강의 항목 처리
      const lectures: LectureType[] = content.map((item: LectureType) => ({
        lectureId: item.lectureId,
        nickname: item.nickname || "",
        description: item.description || "",
        title: item.title || "",
        price: item.price,
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
  } catch (error: unknown) {
    console.log(error);
    return rejectWithValue("강의 데이터 요청 실패");
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
          action: PayloadAction<{
            content: LectureType[];
            totalElements: number;
          }>
        ) => {
          state.status = "succeeded";
          const { content, totalElements } = action.payload;

          // 기존 lectureList에서 lectureId를 기준으로 중복 제거
          const newLectures = content.filter(
            (newLecture) =>
              !state.lectureList.some(
                (existingLecture) =>
                  existingLecture.lectureId === newLecture.lectureId
              )
          );

          state.lectureList = [...state.lectureList, ...newLectures];
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
