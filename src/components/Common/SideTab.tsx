import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const TAB_WIDTH = 160;
const ITEM_HEIGHT = 40;
const GAP = 5;

const TabContainer = styled.div<{ $itemCount: number }>`
  position: fixed;
  top: ${({ theme }) => theme.size.header.height};
  left: -0.5px;
  width: ${TAB_WIDTH}px;
  height: calc(100vh - ${({ theme }) => theme.size.header.height});
  background: ${({ theme }) => theme.colors.background_D};
  backdrop-filter: blur(5px);
  font-family: ${({ theme }) => theme.font.primary};
  transform: translateX(-96%);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  z-index: ${({ theme }) => theme.zIndex.header};

  &:hover,
  &:focus-within {
    transform: translateX(0);
  }
`;

const TabHandle = styled.div`
  position: absolute;
  top: 60px;
  right: -28px;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.background_D};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background 0.2s;
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
  border-radius: 0 8px 8px 0;
  transition: font-weight 0.2s;

  &:hover {
    font-weight: 700;
  }
`;

const TabTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_B};
  padding: 12px 14px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.background_B};
  width: 90%;
`;

interface TabMenuProps {
  items: { id: number; label: string }[];
  title?: string;
  onSelect: (id: number) => void;
}

/**
 * 사이드텝 컴포넌트입니다.
 * @param {Array<{id: number, label: string}>} items - 탭 아이템 배열
 * @param {string} [title] - 사이드 탭 상단에 표시할 타이틀
 * @param {(id: number) => void} onSelect - 탭 클릭 시 호출되는 콜백
 *
 * 사용법: 탭 아이템(셀) 배열 만들어서 넣기
 *
 * const tabItems = [
 *   { id: 1, label: "대시보드1", action: () => alert("대시보드1 선택") },
 *   { id: 2, label: "대시보드2", action: () => alert("대시보드2 선택") },
 *   { id: 3, label: "대시보드3", action: () => alert("대시보드3 선택") },
 *   { id: 4, label: "대시보드4", action: () => console.log("대시보드4 선택") },
 *   { id: 5, label: "대시보드5", action: () => console.log("대시보드5 선택") },
 * ];
 *
 * 이벤트 처리: 선택된 탭의 action 실행
 * const handleTabSelect = (id: number) => {
 *   const tab = tabItems.find(t => t.id === id);
 *   if (tab?.action) tab.action();
 * };
 */

const SideTab: React.FC<TabMenuProps> = ({ title, items, onSelect }) => {
  return (
    <TabContainer tabIndex={0} $itemCount={items.length}>
      <TabHandle>
        <FontAwesomeIcon icon={faBars} />
      </TabHandle>
      {title && <TabTitle>{title}</TabTitle>}
      <TabList>
        {items.map((item) => (
          <TabItem
            key={item.id}
            tabIndex={0}
            role="button"
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </TabItem>
        ))}
      </TabList>
    </TabContainer>
  );
};

export default SideTab;
