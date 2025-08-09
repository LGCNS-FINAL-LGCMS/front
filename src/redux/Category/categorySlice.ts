import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  id: string;
  category: string;
}

const initialState: CategoryState = {
  id: "",
  category: "",
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (
      state,
      action: PayloadAction<{ id: string; category: string }>
    ) => {
      state.id = action.payload.id;
      state.category = action.payload.category;
    },
    clearCategory: (state) => {
      state.id = "";
      state.category = "";
    },
  },
});

export const { setCategory, clearCategory } = categorySlice.actions;

export default categorySlice.reducer;
