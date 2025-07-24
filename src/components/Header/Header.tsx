import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMobileDetect from "../../hooks/useMobileDetect";
import { theme } from "../../assets/styles/theme";
import { PAGE_PATHS } from "../../constants/pagePaths";
import AlertCell from "./AlertCell";

import {
  faCircleUser,
  faBars,
  faSignOutAlt,
  faUserCircle,
  faBell,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

const HEADER_HEIGHT: string = "70px";

interface Alert {
  id: number;
  message: string;
  date?: string;
}

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: ${theme.colors.header};
  backdrop-filter: blur(5px);
  height: ${HEADER_HEIGHT};
  ipadding: 0 1rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  width: 150px;
  background-color: rgba(113, 113, 113, 0.75);
  box-shadow: 0 10px 10px -3px rgba(130, 130, 130, 0.35);
  border: 3px solid rgba(104, 104, 104, 0.5);
  border-radius: 3px;
  z-index: 60;
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${theme.colors.text_D};
  background: none;
  font-weight: 500;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.text_B};
    background-color: ${theme.colors.background_D};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: ${theme.colors.text_D};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    color: ${theme.colors.text_B};
  }
`;

const Container = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
`;

const ActionButton = styled.div`
  padding: 0 16px;
  font-size: 0.875rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    border-color 0.2s ease-in-out, box-shadow 0.25s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  line-height: 1;
  min-height: 38px;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  outline: none;

  svg {
    font-size: 1.1em;
  }

  background-color: rgba(0, 0, 0, 0.25);
  color: ${theme.colors.text_B};

  &:hover {
    background-color: rgba(0, 0, 0, 0.45);
  }
  &:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const UserActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  justify-self: end;
`;

const LogoLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.7rem;

  cursor: pointer;
  font-weight: bold;
  color: ${theme.colors.text_B};

  &:hover {
    color: ${theme.colors.text_D};
  }
`;

const AlertDropdown = styled(DropdownMenu)`
  right: 3rem; /* 위치 조정 (UserButton과 겹치지 않도록) */
  width: 250px;
  background-color: rgba(113, 113, 113, 0.75);
  box-shadow: 0 10px 10px -3px rgba(130, 130, 130, 0.35);
  font-size: 0.85rem;
  padding: 0.5rem 0;
`;

const AlertItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.header};
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 임시 mock 알림
    setAlerts([
      { id: 1, message: "새 댓글이 달렸습니다.", date: "2025-07-24" },
      { id: 2, message: "주문이 완료되었습니다.", date: "2025-07-23" },
      { id: 3, message: "답변이 달렸습니다.", date: "2025-07-23" },
      { id: 4, message: "주문이 완료되었습니다.", date: "2025-07-23" },
      { id: 5, message: "주문이 완료되었습니다.", date: "2025-07-23" },
    ]);
  }, []);

  const onNavigate = (url: string) => {
    navigate(url);
  };

  const handleLogoClick = () => {
    navigate(PAGE_PATHS.HOME);
  };

  const isAuthenticated: boolean = true;
  // const nickname: string = "형균";

  const dropdownRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const isMobile: boolean = useMobileDetect();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        alertRef.current &&
        !alertRef.current.contains(event.target as Node)
      ) {
        setIsAlertOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogin = () => {
    navigate(PAGE_PATHS.LOGIN);
  };

  return (
    <>
      <HeaderWrapper>
        <Container>
          {/* 왼쪽 섹션 */}
          <LogoLink>
            <LogoText onClick={handleLogoClick}>LGCMS</LogoText>
          </LogoLink>

          {/* 가운데 섹션 */}
          <nav>{/* 여기에 로고 넣을까?? */}</nav>

          {/* 오른쪽 섹션*/}
          <UserActionsWrapper ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                {isMobile ? (
                  <UserButton onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                  </UserButton>
                ) : (
                  <>
                    <UserButton>
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </UserButton>

                    <UserButton
                      onClick={() => {
                        setIsAlertOpen((prev) => !prev);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faBell} />
                    </UserButton>

                    <UserButton onClick={toggleDropdown}>
                      <FontAwesomeIcon icon={faCircleUser} />
                    </UserButton>
                  </>
                )}

                {isDropdownOpen && (
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // 로그아웃 로직
                      }}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Log Out
                    </DropdownItem>

                    <DropdownItem
                      onClick={() => {
                        // onNavigate("/userinfo");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faUserCircle} />
                      마이 페이지
                    </DropdownItem>

                    {isMobile && (
                      <>
                        <DropdownItem
                          onClick={() => {
                            setIsAlertOpen((prev) => !prev);
                            setIsDropdownOpen(false);
                            // 알림 로직
                          }}
                        >
                          <FontAwesomeIcon icon={faBell} />
                          알림
                        </DropdownItem>

                        <DropdownItem
                          onClick={() => {
                            setIsDropdownOpen(false);
                            // 장바구니 로직
                          }}
                        >
                          <FontAwesomeIcon icon={faShoppingCart} />
                          장바구니
                        </DropdownItem>
                      </>
                    )}
                  </DropdownMenu>
                )}

                {isAlertOpen && (
                  <AlertDropdown ref={alertRef}>
                    {alerts.length > 0 ? (
                      alerts.map((alert) => (
                        <AlertCell
                          key={alert.id}
                          message={alert.message}
                          date={alert.date}
                        />
                      ))
                    ) : (
                      <AlertItem>새 알림이 없습니다.</AlertItem>
                    )}
                  </AlertDropdown>
                )}
              </>
            ) : (
              <ActionButton onClick={onLogin}>Log In</ActionButton>
            )}
          </UserActionsWrapper>
        </Container>
      </HeaderWrapper>
    </>
  );
};

export { HEADER_HEIGHT };
export default Header;
