import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Lecture } from "../../../types/lecture";

interface CurrentLectureState {
  lecture: Lecture | null;
}

const initialState: CurrentLectureState = {
  lecture: null,
};

export const currentLectureSlice = createSlice({
  name: "currentLecture",
  initialState,
  reducers: {
    setCurrentLecture: (state, action: PayloadAction<Lecture>) => {
      state.lecture = action.payload;
    },
    clearCurrentLecture: (state) => {
      state.lecture = null;
    },
  },
});

export const { setCurrentLecture, clearCurrentLecture } =
  currentLectureSlice.actions;

export default currentLectureSlice.reducer;
