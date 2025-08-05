// src/redux/token/tokenSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logoutRequest } from "../../api/Auth/authApi";

interface TokenState {
  accessToken: string;
  refreshToken: string;
  isExpired: boolean;
  isAuthenticated: boolean;
  isBanned: boolean;
  isMaintenance: boolean;
}

const initialState: TokenState = {
  accessToken: "",
  refreshToken: "",
  isExpired: false,
  isAuthenticated: false,
  isBanned: false,
  isMaintenance: false,
};

export const logoutUsingToken = createAsyncThunk(
  "token/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutRequest();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Logout failed"
      );
    }
  }
);

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isExpired = false;
      state.isAuthenticated = true;
      state.isBanned = false;
      state.isMaintenance = false;
    },
    logout: (state) => {
      Object.assign(state, {
        ...initialState,
        isExpired: true,
      });
    },
    triggerBan: (state) => {
      Object.assign(state, {
        ...initialState,
        isBanned: true,
      });
    },
    maintenance: (state) => {
      Object.assign(state, {
        ...initialState,
        isMaintenance: true,
      });
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUsingToken.fulfilled, (state) => {
        Object.assign(state, {
          ...initialState,
          isExpired: false,
        });
      })
      .addCase(logoutUsingToken.rejected, (state) => {
        Object.assign(state, {
          ...initialState,
          isExpired: false,
        });
      });
  },
});

export const { login, logout, reset, triggerBan, maintenance } =
  tokenSlice.actions;
export default tokenSlice.reducer;
