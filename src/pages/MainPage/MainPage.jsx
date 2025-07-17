import React from "react";

const MainPage = () => {
  return (
    <>
      <div className="font-english">
        This text will use the RedHatDisplay font.
        <br />
        <div className="font-korean">
          이 텍스트는 KoPubWorldDotumMedium 폰트를 사용합니다.
        </div>
        <h1 className="text-3xl font-bold underline">good</h1>
      </div>
    </>
  );
};

export default MainPage;
