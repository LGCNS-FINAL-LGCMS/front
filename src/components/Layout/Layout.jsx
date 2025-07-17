// Layout.js
import React from "react";
import Header, { HEADER_HEIGHT } from "../Header/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div
        className="mx-auto w-full flex justify-center items-center"
        style={{ paddingTop: HEADER_HEIGHT }}
      >
        <div className="flex justify-center items-center min-h-[calc(100vh-140px)] h-full w-full">
          <main
            className="flex justify-center items-center p-5 min-h-[calc(100vh-140px)] h-full w-full max-w-[1280px] mx-auto px-4
            md:max-w-[840px]
            lg:max-w-[1140px]
            xl:max-w-[1280px]
          "
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
