import Layout from "./layouts/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyle from "./assets/styles/globalstyle";
import { ThemeProvider } from "styled-components";
import { theme } from "./assets/styles/theme";
import { PAGE_PATHS } from "./constants/pagePaths";

// =========== 페이지 임포트 ===========
import Login from "./Pages/Login";
import SignupPage from "./Pages/Signup/SignupPage";
import MainPage from "./pages/MainPage/MainPage";
import LectureWatchingPage from "./pages/LectureWatchingPage";
// =========== 페이지 임포트 ===========

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <GlobalStyle />
          <Layout>
            <Routes>
              {/* <Route path="/" element={<MainPage />} /> */}
              <Route path="/login" element={<Login />} />
              <Route
                path={PAGE_PATHS.LECTUREWATCH}
                element={<LectureWatchingPage />}
              />
              <Route path={PAGE_PATHS.HOME} element={<MainPage />} />
              <Route path={PAGE_PATHS.SIGNUP} element={<SignupPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
