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
  CATEGORY: {
    POST: "/api/member",
    GET: "/api/member",
    DELETE: "/api/member", // /{categoryId}
  },
  LECTURE: {
    GET: "/api/lecture",
  },
  QNA: {
    GET: "/api/qna", // /{lectureId}
    POST: "/qna",
    DELETE: "/api/qna", // /{lectureId}
    PATCH: "/api/qna", // /{lectureId}

    MEMBER: {
      GET: "/api/qna/member", // 해당 맴버의 QNA

      LECTURE: {
        POST: "/api/qna/answer", // /{questionId} 답변 작성
        PUT: "/api/qna/answer", // /{answerId} 답변 수정
      },
    },
  },

  GUIDE: {
    POST: "/api/guide/ask",
  },
  MEMBER: {
    DESIRER: "/api/admin/member/lecturer/desirer", // get
    CONFIRM: "/api/admin/member/lecturer/confirm", // post
  },
  
  FAQ: {
    GET: "/api/core/faq",
  },
};
