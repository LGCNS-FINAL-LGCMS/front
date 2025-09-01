// store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import type { PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { injectStore } from "../api/index";

//slice 파일들
import keywordSlice from "./keyword/keywordSlice";
import lectureDataSlice from "./lectureData/lectureDataSlice";
import tokenSlice from "./token/tokenSlice";
import categorySlice from "./Category/categorySlice";
import authSlice from "./Auth/authSlice";
import guideBotSlice from "./GuideBot/guideBotSlice";
import lecturePaginationSlice from "./lectureData/lecturerPageData/lecturerPageData";
import PaymentSlice from "./Payment/paymentSlice";
import studentLecturePagenationSlice from "./lectureData/studentPageData/studentPageDataSlice";
import currentLectureSlice from "./lectureData/currentLectureData/currentLectureSlice";
import currentQnaSlice from "./qna/currentQnaSlice";
import faqListSlice from "./FaqData/FaqDataSlice";
import studentReportSlice from "./StudentReport/StudentReportSlice";

const rootReducer = combineReducers({
  keyword: keywordSlice,
  lectureData: lectureDataSlice,
  lecturerLectureData: lecturePaginationSlice,
  studentLectureData: studentLecturePagenationSlice,
  token: tokenSlice,
  category: categorySlice,
  auth: authSlice,
  guide: guideBotSlice,
  payment: PaymentSlice,
  currentLecture: currentLectureSlice,
  currentQna: currentQnaSlice,
  faq: faqListSlice,
  studentReport: studentReportSlice,
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
