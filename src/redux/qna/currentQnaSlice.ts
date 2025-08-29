import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Qna } from "../../types/qna";

interface CurrentQnaState {
  qna: Qna | null;
}

const initialState: CurrentQnaState = {
  qna: null,
};

export const currentQnaSlice = createSlice({
  name: "currentQnaState",
  initialState,
  reducers: {
    setCurrentQna: (state, action: PayloadAction<Qna>) => {
      state.qna = action.payload;
    },
    clearCurrentQna: (state) => {
      state.qna = null;
    },
  },
});

export const { setCurrentQna, clearCurrentQna } = currentQnaSlice.actions;

export default currentQnaSlice.reducer;
