import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage/MainPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
