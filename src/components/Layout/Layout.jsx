import React from "react";
import Header, { HEADER_HEIGHT } from "../Header/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div
        className="w-full min-h-screen bg-background"
        style={{ paddingTop: HEADER_HEIGHT }}
      >
        <main className="max-w-[1280px] w-full mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
