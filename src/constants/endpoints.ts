// api.ts

export const API_ENDPOINTS = {
  AUTH: {
    LOGOUT: "/auth/logout", // Delete
    GOOGLE_LOGIN: "/auth/sign-in/google", //post
    REFRESH: "/auth/refresh/token", // post
    SIGN_OUT: "/auth/sign-out/google", // post
    CHECK_NICKNAME: "/member/check/nickname", // post
  },

  USER: {
    CHECK_LECTURE_PURCHASED: "/lecturer/lecture/verify",
    INFO: "/member", //get
    UPDATE: "/member/change/info", // patch
    CATEGORY_LIST: "/member/categories",
  },

  LECTURER: {
    GET_LECTURE: "/lecturer/lecture",
  },

  STUDENT: {
    GET_LECTURE: "/api/student/lecture",
  },

  CATEGORY: {
    POST: "/member",
    GET: "/member",
    DELETE: "/member", // /{categoryId}
  },

  LECTURE: {
    REVIEW: {
      GET: "/lecture/review/list", // GET - /{lectureId}
      POST: "/student/lecture/review", // POST - /{lectureId}
    },
    GET: "/lecture",
    OPEN: "/lecturer/lecture", // post
    POST_FILES: "/lecturer/upload/lecture",
  },

  LESSON: {
    POST_META: "/lecturer/lesson",
    POST_FILES: "/lecturer/upload/lesson",
    MODIFY: "/lecturer/lesson",
    DELETE: "/lecturer/lesson",
    GET: {
      DETAIL: "/lesson/details",
      TITLE: "/lesson/title",
      SECTION: "/lesson/section",
    },
  },

  QNA: {
    GET: "/lecture/qna", // /{lectureId}
    POST: "/student/lecture/qna",
    DELETE: "/lecture/qna", // /{lectureId}
    PATCH: "/lecture/qna", // /{lectureId}

    MEMBER: {
      GET: "/lecture/qna/member", // GET - 특정 멤버의 QNA
      LECTURE: {
        POST: " /lecture/qna/answer", // /{questionId} 답변 작성
        PUT: "/lecture/qna/answer", // /{answerId} 답변 수정
      },
    },
  },

  GUIDE: {
    POST: "/guide/ask", // POST
  },

  FAQ: {
    GET: "/core/faq", // GET
    POST: "/guide/ask",
  },
  LEVEL_TEST: {
    GET_QUESTIONS: "/student/leveltest/questions/generate",
    SUBMIT_ANSWERS: "/student/leveltest/answers/submit-all",
  },

  PAYMENT: {
    CART: {
      GET: "/cart", // GET
      POST: "/cart", // POST
    },
    READY: "/payment/ready", // 결제 준비
    BUNDLEREADY: "/payment/list/ready", // 묶음결제 준비
    APPROVE: "/payment/approve", // 결제 승인
  },
  CART: {
    GET: "/cart", // 장바구니 아이템 조회
    POST: "/cart", // 장바구니에 아이템 등록
    DELETE: "/cart", // /{cartId}  단건 삭젝
    COUNT: "/admin/cart/count", //회원별 장바구니 아이템 갯수
  },
  MEMBER: {
    DESIRER: "/admin/member/lecturer/desirer", // get
    CONFIRM: "/admin/member/lecturer/confirm", // post
  },

  CONSULTING: {
    GET_DASHBOARD: "/lecturer/consulting/dashboard", // get
    GET_LECTURER_REPORT: "/lecturer/consulting/report", // get
  },
};
