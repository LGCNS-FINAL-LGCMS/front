import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyle from "./assets/styles/globalstyle";
import { theme } from "./assets/styles/theme";
import { PAGE_PATHS } from "./constants/pagePaths";
import Header from "./components/Header/Header";
import styled, { ThemeProvider } from "styled-components";
import ChatWrapper from "./components/Common/Chat/ChatWrapper";

// =========== 레이아웃 임포트 ===========
import Layout from "./layouts/Layout";
import WideLayout from "./layouts/WideLayout";
// =========== 레이아웃 임포트 ===========

// =========== 페이지 임포트 ===========
import Login from "./pages/Login";
import SignupPage from "./pages/Signup/SignupPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import MainPage from "./pages/MainPage/MainPage";
import LectureWatchingPage from "./pages/LectureWatchingPage";
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
            path={`${PAGE_PATHS.HOME}/:keyword?/:category?`}
            element={
              <Layout>
                <MainPage />
              </Layout>
            }
          />
          {/* =========================== */}

          {/* 와이드 Layout */}
          <Route
            path={PAGE_PATHS.LECTUREWATCH}
            element={
              <WideLayout>
                <LectureWatchingPage />
              </WideLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
