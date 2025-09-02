import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyle from "./assets/styles/globalstyle";
import { theme } from "./assets/styles/theme";
import { PAGE_PATHS } from "./constants/pagePaths";
import Header from "./components/Header/Header";
import { ThemeProvider } from "styled-components";
import ChatWrapper from "./components/Common/Chat/ChatWrapper";

// =========== 레이아웃 임포트 ===========
import Layout from "./layouts/Layout";
// import WideLayout from "./layouts/WideLayout";
// =========== 레이아웃 임포트 ===========

// =========== 페이지 임포트 ===========
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/LoginPage/Login";
import SignupPage from "./pages/SignupPage/SignupPage";
import StudentLecturePage from "./pages/UserMypage/StudentLecturePage";
import StudentQnaPage from "./pages/UserMypage/StudentQnaPage/StudentQnaPage";
import MainPage from "./pages/MainPage/MainPage";
import UpdateUserInfoPage from "./pages/UserMypage/UpdateUserInfoPage";
import CreateLecturePage from "./pages/CreateLecturePage/CreateLecturePage";
import LessonManagementPage from "./pages/LessonManagementPage/LessonManagementPage";
import LecturerMainPage from "./pages/LecturerPage/LecturerMainPage";
import LevelTestPage from "./pages/LevelTestPage/LevelTestPage";
import LevelTestDashboardPage from "./pages/LevelTestPage/LevelTestDashboardPage";
// =========== 페이지 임포트 ===========
import PaymentResultPage from "./pages/PaymentPage/PaymentResultPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import PaymentSuccess from "./pages/PaymentPage/PaymentSuccess";
import AdminPage from "./pages/AdminPage/AdminPage";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import QnaPage from "./pages/QnaPage/QnaPage";
import FaqPage from "./pages/FaqPage/FaqPage";
import StudentReportPage from "./pages/StudentReportPage/StudentReportPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <Header />
        <ChatWrapper />

        <Routes>
          <Route path={PAGE_PATHS.LANDING} element={<LandingPage />} />

          {/* 일반 Layout */}
          <Route
            path={PAGE_PATHS.LOGIN}
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.SIGNUP}
            element={
              <Layout>
                <SignupPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.STUDENT.USER_INFO}
            element={
              <Layout>
                <UpdateUserInfoPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.LEVEL_TEST.DASHBOARD}
            element={
              <Layout>
                <LevelTestDashboardPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.LEVEL_TEST.TEST}
            element={
              <Layout>
                <LevelTestPage />
              </Layout>
            }
          />

          <Route
            path={`${PAGE_PATHS.USER_PAGE.STUDENT.REPORT}/:reportId?`}
            element={
              <Layout>
                <StudentReportPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.STUDENT.MY_LECTURES}
            element={
              <Layout>
                <StudentLecturePage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.STUDENT.QNA}
            element={
              <Layout>
                <StudentQnaPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.FAQ}
            element={
              <Layout>
                <FaqPage />
              </Layout>
            }
          />

          <Route
            path={`${PAGE_PATHS.HOME}/:keyword?/:category?`}
            element={
              <Layout>
                <MainPage />
              </Layout>
            }
          />

          <Route
            path={`${PAGE_PATHS.CREATE_LECTURE}`}
            element={
              <Layout>
                <CreateLecturePage />
              </Layout>
            }
          />

          <Route
            path={`${PAGE_PATHS.USER_PAGE.LECTURER}`}
            element={
              <Layout>
                <LecturerMainPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.PAYMENT.PAYMENT}
            element={
              <Layout>
                <PaymentPage />
              </Layout>
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
            path={`${PAGE_PATHS.Lesson_Management}/:lactureId?`}
            element={
              <Layout>
                <LessonManagementPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.ADMIN}
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path={`${PAGE_PATHS.QNA}/:qnaId?`}
            element={
              <Layout>
                <QnaPage />
              </Layout>
            }
          />
          {/* =========================== */}

          {/* 와이드 Layout */}

          {/* =========================== */}
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
