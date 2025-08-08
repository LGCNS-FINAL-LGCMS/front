// api.ts

// 여기에 api 엔드포인트 적어서 상수로 사용하면됨...
// 잘 모르겠으면 형균씨 찾아오세요

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/sign-in/google", // post
    LOGOUT: "/api/auth/logout", // Delete
    REFRESH: "/api/auth/refresh/token", // post
    SIGN_OUT: "/api/auth/sign-out/google", // post
  },
  USER: {
    INFO: "???",
    UPDATE: "????",
  },
  CATEGORY: {
    POST: "/api/category",
    GET: "/api/category",
    DELETE: "/api/category", // /{categoryId}
  },
  LECTURE: {
    GET: "/api/lecture",
  },
};
