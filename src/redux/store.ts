// store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import type { PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import apiClient, { injectStore } from "../api/index";

//slice 파일들
import keywordSlice from "./keyword/keywordSlice";
import lectureDataSlice from "./lectureData/lectureDataSlice";
import tokenSlice from "./token/tokenSlice";
import categorySlice from "./Category/categorySlice";
import authSlice from "./Auth/authSlice";
import guideBotSlice from "./GuideBot/guideBotSlice";

// slice import 자리 (예: import userReducer from './slices/userSlice';)
const rootReducer = combineReducers({
  keyword: keywordSlice,
  lectureData: lectureDataSlice,
  token: tokenSlice,
  category: categorySlice,
  auth: authSlice,
  guide: guideBotSlice,
});

// persist 설정 타입 지정
const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage,
};

// persist 리듀서 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

injectStore(store);

// persistor 생성
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
