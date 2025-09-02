import React from "react";
import styled from "styled-components";

const TabMenu = styled.div`
  display: flex;
  margin-top: 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray_L};
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  margin-right: 0.2rem;
  border: none;
  border-bottom: ${({ active, theme }) =>
    active ? `4px solid ${theme.colors.primary}` : "4px solid transparent"};
  background: transparent;
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray_D};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.body.max};
  font-weight: 600;
  transition: all 0.3s;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

type TabType = "curriculum" | "reviews" | "qna";

interface LectureTabMenuProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  reviewCount: number;
}

const LectureInfoTabMenu: React.FC<LectureTabMenuProps> = ({
  activeTab,
  setActiveTab,
  reviewCount,
}) => {
  return (
    <TabMenu>
      <TabButton
        active={activeTab === "curriculum"}
        onClick={() => setActiveTab("curriculum")}
      >
        커리큘럼
      </TabButton>
      <TabButton
        active={activeTab === "reviews"}
        onClick={() => setActiveTab("reviews")}
      >
        수강평 ({reviewCount})
      </TabButton>
      <TabButton
        active={activeTab === "qna"}
        onClick={() => setActiveTab("qna")}
      >
        Q&A
      </TabButton>
    </TabMenu>
  );
};

export default LectureInfoTabMenu;
