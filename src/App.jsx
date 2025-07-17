import "./index.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage/MainPage";
import LessionViewerPage from "./pages/LecturePage/LectureViewPage";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/lecture" element={<LessionViewerPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
