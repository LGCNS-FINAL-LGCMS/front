import React from "react";
import styled from "styled-components";

const TAB_WIDTH = 160;
const TOP = 100;
const ITEM_HEIGHT = 40;
const GAP = 5;
const PADDING = 10;

const TabContainer = styled.div<{ itemCount: number }>`
  position: fixed;
  top: ${TOP}px;
  left: -0.5px;
  width: ${TAB_WIDTH}px;
  height: ${({ itemCount }) =>
    itemCount * ITEM_HEIGHT +
    (itemCount > 1 ? (itemCount - 1) * GAP : 0) +
    PADDING +
    1}px;
  background: ${({ theme }) => theme.colors.header};
  border: 1px solid #ccc;
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  font-family: ${({ theme }) => theme.font.primary};
  transform: translateX(-96%);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  z-index: 1000;

  &:hover,
  &:focus-within {
    transform: translateX(0);
  }
`;

const TabHandle = styled.div`
  font-family: ${({ theme }) => theme.font.logo};
  position: absolute;
  top: 28px;
  right: -28px;
  transform: translateY(-60%);
  background: #43434393;
  color: white;
  font-size: 15px;
  padding: 5px;
  border-radius: 0 4px 4px 0;
  writing-mode: vertical-rl;
  text-align: center;
  cursor: pointer;
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
  color: ${({ theme }) => theme.colors.text_B};
  padding: 10px 14px;
  border-radius: 0 4px 4px 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background_B};
    color: ${({ theme }) => theme.colors.text_D};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.background_B};
  }
`;

interface TabMenuProps {
  items: { id: string; label: string }[];
  onSelect: (id: string) => void;
}

/**
 * 사이드텝 컴포넌트입니다. *
 * 사용법: 텝 아이템(셀) 배열 만들어서 넣기
 * const tabItems = [
    { id: "dash1", label: "대시보드1" },
    { id: "dash2", label: "대시보드2" },
    { id: "dash3", label: "대시보드3" },
    { id: "dash4", label: "대시보드4" },
    { id: "dash5", label: "대시보드5" },
  ];
  
  이벤트 만들어서 해당 아이디에 따른 처리 하기
  const handleTabSelect = (id: string) => {
    if (id == "dash1") {
      alert("하이");
    }
    else if(id == "dash2") {
      alert("헬로");
    }
  };
 */
const SideTab: React.FC<TabMenuProps> = ({ items, onSelect }) => {
  return (
    <TabContainer tabIndex={0} itemCount={items.length}>
      <TabHandle>TAB</TabHandle>
      <TabList>
        {items.map((item) => (
          <TabItem
            key={item.id}
            tabIndex={0}
            role="button"
            onClick={() => onSelect(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(item.id);
              }
            }}
          >
            {item.label}
          </TabItem>
        ))}
      </TabList>
    </TabContainer>
  );
};

export default SideTab;
