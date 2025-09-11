import React from "react";
import styled from "styled-components";

const TAB_WIDTH = 240;
const ITEM_HEIGHT = 200;
const GAP = 8;

const Wrapper = styled.nav`
  width: ${TAB_WIDTH}px;
  height: calc(100vh - ${({ theme }) => theme.size.header.height});
  position: fixed;
  top: ${({ theme }) => theme.size.header.height};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: ${({ theme }) => theme.zIndex.header};
  left: 0;
`;

const TabContainer = styled.div<{ $itemCount: number }>`
  width: ${TAB_WIDTH}px;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  backdrop-filter: blur(5px);
  font-family: ${({ theme }) => theme.font.primary};
  z-index: ${({ theme }) => theme.zIndex.header};
`;

const TabList = styled.ul`
  list-style: none;
  margin: 30px 0 0 0;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${ITEM_HEIGHT}px;
  gap: ${GAP}px;
`;

const TabItem = styled.li<{ isActive: boolean }>`
  font-size: 1rem;
  padding: 10px 14px;
  transition: ${({ theme }) => theme.transition.default};
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;

  //active일 때
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.white : theme.colors.gray_D};
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.gray_D : "none"};
  font-weight: ${({ isActive }) => (isActive ? 700 : 500)};

  &:hover {
    font-weight: 700;
    background: ${({ theme }) => theme.colors.gray_D};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const TabTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray_M};
  padding: 24px;
  width: 100%;
  display: flex;
`;

interface TabMenuProps {
  items: { id: number; label: string }[];
  title?: string;
  currentItemId?: number;
  onSelect: (id: number) => void;
}

const SideTab: React.FC<TabMenuProps> = ({
  title,
  items,
  currentItemId,
  onSelect,
}) => {
  return (
    <Wrapper>
      <TabContainer $itemCount={items.length}>
        {title && <TabTitle>{title}</TabTitle>}
        <TabList>
          {items.map((item) => (
            <TabItem
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item.id)}
              isActive={currentItemId === item.id}
            >
              {item.label}
            </TabItem>
          ))}
        </TabList>
      </TabContainer>
    </Wrapper>
  );
};

export default SideTab;
