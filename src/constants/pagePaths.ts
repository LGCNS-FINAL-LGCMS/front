// pagePaths.ts

// 프론트 페이지 주소 적어서 상수로 사용하면됨...
// 잘 모르겠으면 형균씨 찾아오세요

export const PAGE_PATHS = {
  LANDING: "/",
  HOME: "/home",
  LOGIN: "/login",
  SIGNUP: "/signup",
  MY_COURSES: "/??",
  LEVEL_TEST: {
    DASHBOARD: "/member/student/leveltest/dashboard",
    TEST: "/member/student/leveltest",
  },
  FAQ: "/faq",
  CREATE_LECTURE: "/openlecture",
  Lesson_Management: "/member/lecturer/lessons",
  CART: "/cart",
  QNA: "/qna",
  USER_PAGE: {
    STUDENT: {
      MY_LECTURES: "/userpage/student",
      QNA: "/member/qna",
      REPORT: "/member/student/report",
      USER_INFO: "/userinfo",
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
