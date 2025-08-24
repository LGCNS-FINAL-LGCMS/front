// api.ts

// 여기에 api 엔드포인트 적어서 상수로 사용하면됨...
// 잘 모르겠으면 형균씨 찾아오세요

export const API_ENDPOINTS = {
  AUTH: {
    LOGOUT: "/api/auth/logout", // Delete
    GOOGLE_LOGIN: "/api/auth/sign-in/google", //post
    REFRESH: "/api/auth/refresh/token", // post
    SIGN_OUT: "/api/auth/sign-out/google", // post
    CHECK_NICKNAME: "/api/member/check/nickname", // post
  },
  USER: {
    INFO: "/api/member", //get
    UPDATE: "/api/member/change/info", // patch
    CATEGORY_LIST: "/api/member/categories",
  },
  LECTURER: {
    GET_LECTURE: "/api/lecture",
  },
  STUDENT: {
    GET_LECTURE: "/???",
  },
  LECTURE: {
    GET: "/api/lecture",
  },
  CATEGORY: {
    POST: "/api/member",
    GET: "/api/member",
    DELETE: "/api/member", // /{categoryId}
  },

  GUIDE: {
    POST: "/api/guide/ask",
  },
  LEVEL_TEST: {
    GET_QUESTIONS: "/student/leveltest/questions/generate",
    SUBMIT_ANSWERS: "/student/leveltest/answers/submit-all",
  },
};
