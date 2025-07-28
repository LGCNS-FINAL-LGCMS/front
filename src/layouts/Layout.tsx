// Layout.tsx
import type { ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../assets/styles/theme";
import Header from "../components/Header/Header";

const HEADER_HEIGHT: string = theme.size.header_Height;

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

// children 타입 지정
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <AppWrapper>
        <LayoutContainer>
          <MainContent>{children}</MainContent>
        </LayoutContainer>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default Layout;
