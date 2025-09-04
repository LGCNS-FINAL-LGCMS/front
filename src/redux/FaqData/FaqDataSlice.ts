import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "../../api";
import { API_ENDPOINTS } from "../../constants/endpoints";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqState {
  faqList: FaqItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

//slice
const initialState: FaqState = {
  faqList: [],
  status: "idle",
  error: null,
};

export const fetchFaqList = createAsyncThunk<
  { content: FaqItem[] },
  void,
  { rejectValue: string }
>("faqlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.FAQ.GET);

    if (response.data?.status === "OK") {
      const faqData = response.data.data;
      const faqListData: FaqItem[] = faqData.map((item: FaqItem) => ({
        id: item.id,
        question: item.question || "",
        answer: item.answer || "",
      }));
      console.log();
      return { content: faqListData };
    } else {
      throw new Error(
        response.data.message || "FAQ 데이터를 불러오지 못했습니다."
      );
    }
  } catch (error) {
    console.log("FAQ Api 연동 실패", error);
    return rejectWithValue("FAQ 데이터 요청 실패");
  }
});

const faqListSlice = createSlice({
  name: "faqListData",
  initialState,
  reducers: {
    resetFaqList: (state) => {
      state.faqList = [];
      state.status = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFaqList.fulfilled,
        (
          state,
          action: PayloadAction<{
            content: FaqItem[];
          }>
        ) => {
          state.status = "succeeded";
          state.faqList = action.payload.content;
          state.error = null;
        }
      )
      .addCase(fetchFaqList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "FAQ를 불러올 수 없음";
      });
  },
});

export const { resetFaqList, clearError } = faqListSlice.actions;
export default faqListSlice.reducer;
