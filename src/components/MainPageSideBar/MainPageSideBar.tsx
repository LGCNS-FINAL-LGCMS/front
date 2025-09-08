import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  faBookOpen,
  faChartLine,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { theme } from "../../assets/styles/theme";
import { PAGE_PATHS } from "../../constants/pagePaths";

const SidebarWrapper = styled.nav`
  width: 100px;
  height: calc(100vh - ${theme.size.header.height});
  position: fixed;
  top: ${theme.size.header.height};
  left: 0;
  background-color: ${theme.colors.text_D};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  z-index: ${theme.zIndex.header};
`;

const IconButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${({ active, theme }) =>
    active ? theme.colors.secondary : theme.colors.text_B};
  cursor: pointer;
  font-size: 1.6rem;
  transition: color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const IconLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.font.primary};
  color: inherit;
  user-select: none;
`;

interface SidebarProps {
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );

  return (
    <SidebarWrapper>
      {isAuthenticated ? (
        <>
          <IconButton
            title="나의 강좌"
            active={activePage === "my-courses"}
            onClick={() => navigate(PAGE_PATHS.USER_PAGE.STUDENT.MY_LECTURES)}
          >
            <FontAwesomeIcon icon={faBookOpen} />
            <IconLabel>나의 강좌</IconLabel>
          </IconButton>

          <IconButton
            title="레벨테스트"
            active={activePage === "level-test"}
            onClick={() => navigate(PAGE_PATHS.LEVEL_TEST.DASHBOARD)}
          >
            <FontAwesomeIcon icon={faChartLine} />
            <IconLabel>레벨테스트</IconLabel>
          </IconButton>

          <IconButton
            title="FAQ"
            active={activePage === "faq"}
            onClick={() => navigate(PAGE_PATHS.FAQ)}
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
            <IconLabel>FAQ</IconLabel>
          </IconButton>
        </>
      ) : (
        <IconButton
          title="FAQ"
          active={activePage === "faq"}
          onClick={() => navigate(PAGE_PATHS.FAQ)}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
          <IconLabel>FAQ</IconLabel>
        </IconButton>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;
