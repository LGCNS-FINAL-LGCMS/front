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
import MainPage from "./pages/MainPage/MainPage";
import LectureWatchingPage from "./pages/LectureWatchingPage";
import Login from "./pages/Login";
// =========== 페이지 임포트 ===========

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <Header />
        <ChatWrapper />

        <Routes>
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
            path={PAGE_PATHS.HOME}
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
