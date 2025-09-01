// api.ts

export const API_ENDPOINTS = {
  AUTH: {
    LOGOUT: "/api/auth/logout", // DELETE
    GOOGLE_LOGIN: "/api/auth/sign-in/google", // POST
    REFRESH: "/api/auth/refresh/token", // POST
    SIGN_OUT: "/api/auth/sign-out/google", // POST
    CHECK_NICKNAME: "/api/member/check/nickname", // POST
  },

  USER: {
    INFO: "/api/member", // GET
    UPDATE: "/api/member/change/info", // PATCH
    CATEGORY_LIST: "/api/member/categories", // GET
    CHECK_LECTURE_PURCHASED: "/api/lecture/verify",
  },

  LECTURER: {
    GET_LECTURE: "/api/lecture", // GET
  },

  STUDENT: {
    GET_LECTURE: "/api/student/lecture",
  },

  CATEGORY: {
    POST: "/api/member", // POST
    GET: "/api/member", // GET
    DELETE: "/api/member", // DELETE - /{categoryId}
  },

  LECTURE: {
    GET: "/api/lecture", // GET
    REVIEW: {
      GET: "/review/list", // GET - /{lectureId}
      POST: "/review/list", // POST - /{lectureId}
    },
  },

  QNA: {
    GET: "/api/qna", // GET - /{lectureId}
    POST: "/qna", // POST
    DELETE: "/api/qna", // DELETE - /{lectureId}
    PATCH: "/api/qna", // PATCH - /{lectureId}

    MEMBER: {
      GET: "/api/qna/member", // GET - 특정 멤버의 QNA
      LECTURE: {
        POST: "/api/qna/answer", // POST - /{questionId}
        PUT: "/api/qna/answer", // PUT - /{answerId}
      },
    },
  },

  GUIDE: {
    POST: "/api/guide/ask", // POST
  },

  PAYMENT: {
    CART: {
      GET: "/cart", // GET
      POST: "/cart", // POST
    },
  },

  FAQ: {
    GET: "/api/core/faq", // GET
  },
};
