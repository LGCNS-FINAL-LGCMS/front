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
  CATEGORY: {
    POST: "/api/member",
    GET: "/api/member",
    DELETE: "/api/member", // /{categoryId}
  },
  LECTURE: {
    GET: "/api/lecture",
  },

  GUIDE: {
    POST: "/api/guide/ask",
  },

  PAYMENT: {
    READY: "/payment/ready",  // 결제 준비
    BUNDLEREADY: "/payment/list/ready",  // 묶음결제 준비
    APPROVE: "/payment/approve",  // 결제 승인
  },
  CART: {
    GET: "/cart",  // 장바구니 아이템 조회
    POST: "/cart",  // 장바구니에 아이템 등록
    DELETE: "/cart", // /{cartId}  단건 삭젝
    COUNT: "/admin/cart/count", //회원별 장바구니 아이템 갯수 
  },
};
