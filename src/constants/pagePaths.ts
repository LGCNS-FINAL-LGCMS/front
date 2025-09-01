// pagePaths.ts

// 프론트 페이지 주소 적어서 상수로 사용하면됨...
// 잘 모르겠으면 형균씨 찾아오세요

export const PAGE_PATHS = {
  LANDING: "/",
  HOME: "/home",
  LOGIN: "/login",
  SIGNUP: "/signup",
  USER_INFO: "/userinfo",
  MY_COURSES: "/??",
  REPORT: "/??",
  LEVEL_TEST: {
    DASHBOARD: "/member/student/leveltest/dashboard",
    TEST: "/member/student/leveltest",
  },
  FAQ: "/faq",
  CREATE_LECTURE: "/openlecture",
  LESSON_MANAGEMENT: "/member/lecturer/lessons",
  CART: "/cart",
  QNA: "/qna",
  LESSON_VIEW: "/lessonview",
  USER_PAGE: {
    STUDENT: {
      MY_LECTURES: "/userpage/student",
      QNA: "/member/qna",
    },
    LECTURER: "/userpage/lecturer",
  },
  PAYMENT: {
    PAYMENT: "/payment",
    SUCCESS: "/success",
    CANCEL: "/cancel",
    FAIL: "/fail",
    RESULT: "/payment/result",
  },
  ADMIN: "/admin",
};
