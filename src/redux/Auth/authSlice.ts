import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserCategoriesList } from "../../types/authInfo";

interface UserInfo {
  memberId: number;
  nickname: string;
  role: "ADMIN" | "LECTURER" | "STUDENT";
  getDesireLecturer: boolean;
  categories: UserCategoriesList[];
}

const initialState: UserInfo = {
  memberId: 0,
  nickname: "",
  role: "STUDENT",
  getDesireLecturer: false,
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
        getDesireLecturer: boolean;
        categories: UserCategoriesList[];
      }>
    ) => {
      state.memberId = action.payload.memberId;
      state.nickname = action.payload.nickname;
      state.role = action.payload.role;
      state.getDesireLecturer = action.payload.getDesireLecturer;
      state.categories = action.payload.categories;
    },
    resetUserInfo: (state) => {
      state.memberId = 0;
      state.nickname = "";
      state.role = "STUDENT";
      state.getDesireLecturer = false;
      state.categories = [];
    },

    updateuserNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    updateCategories: (state, action: PayloadAction<UserCategoriesList[]>) => {
      state.categories = action.payload;
    },
    updateIsLecturer: (state, action: PayloadAction<boolean>) => {
      state.getDesireLecturer = action.payload;
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
