import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

export const faqList = createAsyncThunk("faqlist/fetch", async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.FAQ.GET);

    if (response.data?.status === "OK") {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "FAQ 서버 연결 안됨");
    }
  } catch (error) {
    console.log("FAQ 데이터를 불러올 수 없습니다.", error);
    throw error;
  }
});

//slice
const initialState: FaqState = {
  faqList: [],
  status: "idle",
  error: null,
};

const faqListSlice = createSlice({
  name: "faq",
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
      .addCase(faqList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(faqList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.faqList = action.payload; // FAQ 목록 저장
        state.error = null;
      })
      .addCase(faqList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "FAQ를 불러올 수 없음";
      });
  },
});

export const { resetFaqList, clearError } = faqListSlice.actions;
export default faqListSlice.reducer;
