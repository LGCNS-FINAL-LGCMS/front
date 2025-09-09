import React from "react";
import styled from "styled-components";

const TAB_WIDTH = 160;
const ITEM_HEIGHT = 40;
const GAP = 5;

const Wrapper = styled.nav`
  width: ${TAB_WIDTH}px;
  height: calc(100vh - ${({ theme }) => theme.size.header.height});
  position: fixed;
  top: ${({ theme }) => theme.size.header.height};
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.header};
`;

const TabContainer = styled.div<{ $itemCount: number }>`
  width: ${TAB_WIDTH}px;
  height: calc(100% - 40px);
  background: ${({ theme }) => theme.colors.secondary};
  backdrop-filter: blur(5px);
  border-radius: 20px;
  font-family: ${({ theme }) => theme.font.primary};
  z-index: ${({ theme }) => theme.zIndex.header};
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const TabList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 5px 3px 1px 1px;
  display: flex;
  flex-direction: column;
  gap: ${GAP}px;
`;

const TabItem = styled.li`
  font-size: 1rem;
  height: ${ITEM_HEIGHT}px;
  color: ${({ theme }) => theme.colors.text_D};
  padding: 10px 14px;
  margin: 0px 5px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow.md};

  transition: font-weight 0.2s;

  &:hover {
    font-weight: 700;
    background: ${({ theme }) => theme.colors.gray_M};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const TabTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text_B};
  padding: 12px 14px;
  width: 90%;
`;

interface TabMenuProps {
  items: { id: number; label: string }[];
  title?: string;
  onSelect: (id: number) => void;
}

const SideTab: React.FC<TabMenuProps> = ({ title, items, onSelect }) => {
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
