import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserCategoriesList } from "../../types/authInfo";

interface UserInfo {
  memberId: number;
  nickname: string;
  role: "ADMIN" | "LECTURER" | "STUDENT";
  desireLecturer: boolean;
  categories: UserCategoriesList[];
}

const initialState: UserInfo = {
  memberId: -1,
  nickname: "",
  role: "STUDENT",
  desireLecturer: false,
  categories: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{
        memberId: number;
        nickname: string;
        role: "ADMIN" | "LECTURER" | "STUDENT";
        desireLecturer: boolean;
        categories: UserCategoriesList[];
      }>
    ) => {
      state.memberId = action.payload.memberId;
      state.nickname = action.payload.nickname;
      state.role = action.payload.role;
      state.desireLecturer = action.payload.desireLecturer;
      state.categories = action.payload.categories;
    },
    resetUserInfo: (state) => {
      state.memberId = -1;
      state.nickname = "";
      state.role = "STUDENT";
      state.desireLecturer = false;
      state.categories = [];
    },

    updateuserNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    updateCategories: (state, action: PayloadAction<UserCategoriesList[]>) => {
      state.categories = action.payload;
    },
    updateIsLecturer: (state, action: PayloadAction<boolean>) => {
      state.desireLecturer = action.payload;
    },
  },
});

export const {
  setUserInfo,
  resetUserInfo,
  updateuserNickname,
  updateCategories,
  updateIsLecturer,
} = authSlice.actions;
export default authSlice.reducer;
