// api.ts

// 여기에 api 엔드포인트 적어서 상수로 사용하면됨...
// 잘 모르겠으면 형균씨 찾아오세요

export const API_ENDPOINTS = {
  AUTH: {
    LOGOUT: "/auth/logout", // Delete
    GOOGLE_LOGIN: "/auth/sign-in/google", //post
    REFRESH: "/auth/refresh/token", // post
    SIGN_OUT: " /auth/sign-out/google", // post
    CHECK_NICKNAME: " /member/check/nickname", // post
  },
  USER: {
    INFO: "/member", //get
    UPDATE: "/member/change/info", // patch
    CATEGORY_LIST: "/member/categories",
  },
  LECTURER: {
    GET_LECTURE: "/lecturer/lecture",
  },
  STUDENT: {
    GET_LECTURE: "/???",
  },

  CATEGORY: {
    POST: "/member",
    GET: "/member",
    DELETE: "/member", // /{categoryId}
  },
  LECTURE: {
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
    GET: "/qna", // /{lectureId}
    POST: "/qna",
    DELETE: "/qna", // /{lectureId}
    PATCH: "/qna", // /{lectureId}

    MEMBER: {
      GET: " /qna/member", // 해당 맴버의 QNA

      LECTURE: {
        POST: " /qna/answer", // /{questionId} 답변 작성
        PUT: "/qna/answer", // /{answerId} 답변 수정
      },
    },
  },

  GUIDE: {
    POST: "/guide/ask",
  },
  LEVEL_TEST: {
    GET_QUESTIONS: "/student/leveltest/questions/generate",
    SUBMIT_ANSWERS: "/student/leveltest/answers/submit-all",
  },

  PAYMENT: {
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

  FAQ: {
    GET: "/core/faq",
  },
};
