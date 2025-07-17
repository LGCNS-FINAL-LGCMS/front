import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage/MainPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
