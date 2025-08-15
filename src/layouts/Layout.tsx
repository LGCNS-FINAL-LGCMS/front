// Layout.tsx
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../assets/styles/theme";

const HEADER_HEIGHT: string = theme.size.header.height;

import { useState } from "react";
import { PAGE_PATHS } from "../constants/pagePaths";

const AppWrapper = styled.div`
  padding-top: ${HEADER_HEIGHT};
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 840px;
  }

  @media (min-width: 1024px) {
    max-width: 1140px;
  }

  @media (min-width: 1440px) {
    max-width: 1280px;
  }
`;

const LayoutContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const MainContent = styled.main`
  padding: 20px;
  min-height: calc(100vh - ${HEADER_HEIGHT});
  width: 100%;
`;

// 채팅 관련 포지션 고정
const ChatFixedWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
`;

// children 타입 지정
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AppWrapper>
      <LayoutContainer>
        <MainContent>{children}</MainContent>
      </LayoutContainer>
    </AppWrapper>
  );
};

export default Layout;
