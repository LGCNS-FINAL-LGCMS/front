// WideLayout.tsx
import type { ReactNode } from "react";
import styled from "styled-components";

const WideWrapper = styled.div`
  padding-top: ${({ theme }) => theme.size.header.height};
  margin: 0 auto;
  width: 100%;
  max-width: ${({ theme }) => theme.size.layout.L};
`;

const MainContent = styled.main`
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height});
  width: 100%;
  padding-top: 20px;
`;

interface WideLayoutProps {
  children: ReactNode;
}

const WideLayout = ({ children }: WideLayoutProps) => {
  return (
    <WideWrapper>
      <MainContent>{children}</MainContent>
    </WideWrapper>
  );
};

export default WideLayout;
