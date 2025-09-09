import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyle from "./assets/styles/globalstyle";
import { theme } from "./assets/styles/theme";
import { PAGE_PATHS } from "./constants/pagePaths";
import Header from "./components/Header/Header";
import { ThemeProvider } from "styled-components";
import ChatWrapper from "./components/Common/Chat/ChatWrapper";
import LecturerSideBar from "./components/LecturerSideBar/LecturerSideBar";
import RoleGuard from "./components/Common/RoleGuard";

// =========== 레이아웃 임포트 ===========
import Layout from "./layouts/Layout";
// import WideLayout from "./layouts/WideLayout";
// =========== 레이아웃 임포트 ===========

// =========== 페이지 임포트 ===========
import Login from "./pages/LoginPage/Login";
import SignupPage from "./pages/SignupPage/SignupPage";
import StudentLecturePage from "./pages/UserMypage/StudentLecturePage";
import StudentQnaPage from "./pages/UserMypage/StudentQnaPage/StudentQnaPage";
import MainPage from "./pages/MainPage/MainPage";
import UpdateUserInfoPage from "./pages/UserMypage/UpdateUserInfoPage";
import CreateLecturePage from "./pages/CreateLecturePage/CreateLecturePage";
import LessonManagementPage from "./pages/LessonManagementPage/LessonManagementPage";
import LecturerMainPage from "./pages/LecturerPage/LecturerMainPage";
import LessonViewPage from "./pages/LessonViewPage/LessonViewPage";
import QnaPage from "./pages/QnaPage/QnaPage";
import FaqPage from "./pages/FaqPage/FaqPage";
import LectureInfoPage from "./pages/LectureInfoPage/LectureInfoPage";
import LecturerDashboardPage from "./pages/LecturerPage/LecturerDashboardPage";
import LevelTestPage from "./pages/LevelTestPage/LevelTestPage";
import LevelTestDashboardPage from "./pages/LevelTestPage/LevelTestDashboardPage";
import PaymentResultPage from "./pages/PaymentPage/PaymentResultPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import PaymentSuccess from "./pages/PaymentPage/PaymentSuccess";
import AdminPage from "./pages/AdminPage/AdminPage";
// import ProtectedRoute from "./components/Admin/ProtectedRoute";
import StudentReportPage from "./pages/StudentReportPage/StudentReportPage";
import LecturerReportPage from "./pages/LecturerPage/LecturerReportPage";
import StudentSideBar from "./components/StudentSideBar/StudentSideBar";
// import LoginGuard from "./components/Admin/LoginGuard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <Header />
        <ChatWrapper />
        <LecturerSideBar />
        <StudentSideBar />

        <Routes>
          {/* 일반 Layout */}
          <Route
            path={PAGE_PATHS.LOGIN}
            element={
              <RoleGuard minRole="GUEST">
                <Layout>
                  <Login />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.SIGNUP}
            element={
              <RoleGuard minRole="GUEST">
                <Layout>
                  <SignupPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.STUDENT.USER_INFO}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <UpdateUserInfoPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.LEVEL_TEST.DASHBOARD}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <LevelTestDashboardPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.LEVEL_TEST.TEST}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <LevelTestPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={`${PAGE_PATHS.USER_PAGE.STUDENT.REPORT}/:reportId?`}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <StudentReportPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.STUDENT.MY_LECTURES}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <StudentLecturePage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.STUDENT.QNA}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <StudentQnaPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.FAQ}
            element={
              <RoleGuard minRole="GUEST">
                <Layout>
                  <FaqPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={`${PAGE_PATHS.HOME}/:keyword?/:category?`}
            element={
              <RoleGuard minRole="GUEST">
                <Layout>
                  <MainPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={`${PAGE_PATHS.CREATE_LECTURE}`}
            element={
              <RoleGuard minRole="LECTURER">
                <Layout>
                  <CreateLecturePage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={`${PAGE_PATHS.USER_PAGE.LECTURER.MAIN}`}
            element={
              <RoleGuard minRole={"LECTURER"}>
                <Layout>
                  <LecturerMainPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.PAYMENT.PAYMENT}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <PaymentPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.PAYMENT.RESULT}
            element={
              <Layout>
                <PaymentResultPage />
              </Layout>
            }
          />

          <Route
            path={`${PAGE_PATHS.LESSON_MANAGEMENT}/:lectureId?`}
            element={
              <RoleGuard minRole={"LECTURER"}>
                <Layout>
                  <LessonManagementPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={`${PAGE_PATHS.LECTURE_INFO}/:lectureId`}
            element={
              <RoleGuard minRole={"GUEST"}>
                <Layout>
                  <LectureInfoPage />
                </Layout>
              </RoleGuard>
            }
          />
          <Route
            path={PAGE_PATHS.ADMIN}
            element={
              <RoleGuard minRole="ADMIN">
                <Layout>
                  <AdminPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={`${PAGE_PATHS.QNA}/:qnaId?`}
            element={
              <RoleGuard minRole="STUDENT">
                <Layout>
                  <QnaPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.LECTURER.DASHBOARD}
            element={
              <RoleGuard minRole="LECTURER">
                <Layout>
                  <LecturerDashboardPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.LECTURER.REPORT}
            element={
              <RoleGuard minRole="LECTURER">
                <Layout>
                  <LecturerReportPage />
                </Layout>
              </RoleGuard>
            }
          />
          {/* =========================== */}

          {/* 와이드 Layout */}

          <Route
            path={`${PAGE_PATHS.LESSON_VIEW}/:lectureId?`}
            element={
              <RoleGuard minRole="STUDENT">
                <LessonViewPage />
              </RoleGuard>
            }
          />
          <Route
            path={`${PAGE_PATHS.PAYMENT.SUCCESS}`}
            element={<PaymentSuccess />}
          />
          <Route
            path={`${PAGE_PATHS.PAYMENT.FAIL}`}
            element={<PaymentSuccess />}
          />
          <Route
            path={`${PAGE_PATHS.PAYMENT.CANCEL}`}
            element={<PaymentSuccess />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
