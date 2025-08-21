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
import Login from "./pages/Login/Login";
import SignupPage from "./pages/Signup/SignupPage";
import StudentLecturePage from "./pages/UserMypage/StudentLecturePage";
import MainPage from "./pages/MainPage/MainPage";
import UpdateUserInfoPage from "./pages/UserMypage/UpdateUserInfoPage";
import CreateLecturePage from "./pages/CreateLecturePage/CreateLecturePage";
import LessonManagementPage from "./pages/LessonManagementPage/LessonManagementPage";
import LecturerMainPage from "./pages/LecturerPage/LecturerMainPage";
// =========== 페이지 임포트 ===========

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
            path={PAGE_PATHS.USER_INFO}
            element={
              <Layout>
                <UpdateUserInfoPage />
              </Layout>
            }
          />

          <Route
            path={PAGE_PATHS.USER_PAGE.STUDENT}
            element={
              <Layout>
                <StudentLecturePage />
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
            path={`${PAGE_PATHS.Lesson_Management}/:lactureId?`}
            element={
              <Layout>
                <LessonManagementPage />
              </Layout>
            }
          />
          {/* =========================== */}

          {/* 와이드 Layout */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
