import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="font-korean">
        이 텍스트는 KoPubWorldDotumMedium 폰트를 사용합니다.
      </div>
      <div className="font-english">
        This text will use the RedHatDisplay font.
      </div>
      <h1 className="text-3xl font-bold underline">good</h1>
    </>
  );
}

export default App;
