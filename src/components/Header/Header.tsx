import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMobileDetect from "../../hooks/useMobileDetect";
import { PAGE_PATHS } from "../../constants/pagePaths";
import AlertCell from "./AlertCell";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { clearCategory } from "../../redux/Category/categorySlice";
import { logoutUsingToken } from "../../redux/token/tokenSlice";
import { resetUserInfo } from "../../redux/Auth/authSlice";

import {
  faCircleUser,
  faBars,
  faSignOutAlt,
  faUserCircle,
  faBell,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../assets/styles/theme";

interface Alert {
  id: number;
  message: string;
  date?: string;
  url?: string;
}

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  background-color: ${({ theme }) => theme.colors.header};
  height: ${({ theme }) => theme.size.header.height};
  backdrop-filter: blur(5px);
  padding: 0 1rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  width: 150px;
  background-color: ${({ theme }) => theme.colors.header};
  backdrop-filter: blur(8px);
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
  color: ${({ theme }) => theme.colors.text_B};
  background: none;
  font-weight: 400;
  font-family: ${({ theme }) => theme.font.primary};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background_D};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const UserButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text_D};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.text_B};
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
  font-size: ${({ theme }) => theme.fontSize.button.max};
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
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
  color: ${({ theme }) => theme.colors.text_B};

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
  padding: 8px;
  gap: 0.5rem;
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-family: ${({ theme }) => theme.font.logo};
  cursor: pointer;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_B};

  &:hover {
    color: ${({ theme }) => theme.colors.text_D};
  }
`;

const AlertDropdown = styled(DropdownMenu)`
  right: 3rem;
  width: 250px;
  background-color: ${theme.colors.header};
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
const Nickname = styled.span`
  font-size: ${theme.fontSize.small.max};
  font-weight: 700;
  color: inherit;
`;

const ping = keyframes`
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const DotWrapper = styled.span`
  position: absolute;
  top: 0px; // 아이콘 크기에 맞게 미세 조정
  right: 5px;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const Ping = styled.span`
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary || "skyblue"};
  opacity: 0.75;
  animation: ${ping} 1s cubic-bezier(0, 0, 0.2, 1) infinite;
`;

const Dot = styled.span`
  pointer-events: none;
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary || "deepskyblue"};
`;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setAlerts([
      {
        id: 1,
        message: "새 댓글이 달렸습니다.",
        date: "2025-07-24",
        url: "/",
      },
      {
        id: 2,
        message: "주문이 완료되었습니다.",
        date: "2025-07-23",
        url: "/orders/123",
      },
      {
        id: 3,
        message: "답변이 달렸습니다.",
        date: "2025-07-23",
        url: "/answers/45",
      },
      {
        id: 4,
        message: "주문이 완료되었습니다.",
        date: "2025-07-23",
        url: "/orders/124",
      },
      {
        id: 5,
        message: "주문이 완료되었습니다.",
        date: "2025-07-23",
        url: "/orders/125",
      },
    ]);
  }, []);

  const handleAlertClick = (url?: string) => {
    if (url) {
      navigate(url);
      setIsAlertOpen(false);
    }
  };

  const handleLogoClick = () => {
    dispatch(clearCategory());
    navigate(PAGE_PATHS.HOME);
  };

  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );
  const nickname: string = auth.nickname;
  const isLecturer: boolean = auth.role === "LECTURER";
  const hasUnreadAlerts = true;
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

  const handleLogout = () => {
    dispatch(logoutUsingToken())
      .unwrap()
      .then(() => {
        dispatch(resetUserInfo());
        navigate(PAGE_PATHS.LOGIN);
      });
  };

  return (
    <HeaderWrapper>
      <Container>
        {/* 왼쪽 섹션 */}
        <LogoLink>
          <LogoText onClick={handleLogoClick}>LGCMS</LogoText>
        </LogoLink>

        {/* 가운데 섹션 */}
        <nav>{/* 여기에 로고 넣을까?? */}</nav>

        {/* 오른쪽 섹션 */}
        <UserActionsWrapper ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              {isMobile ? (
                <UserButton onClick={toggleDropdown}>
                  <FontAwesomeIcon icon={faBars} size="lg" />
                </UserButton>
              ) : (
                <>
                  <UserButton
                    onClick={() => {
                      navigate(PAGE_PATHS.PAYMENT.PAYMENT);
                    }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </UserButton>

                  <UserButton
                    onClick={() => {
                      setIsAlertOpen((prev) => !prev);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faBell} />
                    {hasUnreadAlerts && (
                      <DotWrapper>
                        <Ping />
                        <Dot />
                      </DotWrapper>
                    )}
                  </UserButton>

                  <UserButton onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faCircleUser} />
                    {!isMobile && (
                      <Nickname>
                        {nickname}
                        {isAuthenticated && "님"}
                      </Nickname>
                    )}
                  </UserButton>
                </>
              )}

              {isDropdownOpen && (
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Log Out
                  </DropdownItem>

                  <DropdownItem
                    onClick={() => {
                      navigate(PAGE_PATHS.USER_PAGE.STUDENT.MY_LECTURES);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} />
                    마이 페이지
                  </DropdownItem>

                  {isLecturer && (
                    <DropdownItem
                      onClick={() => {
                        navigate(PAGE_PATHS.USER_PAGE.LECTURER.MAIN);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faUserCircle} />
                      강사 페이지
                    </DropdownItem>
                  )}

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
                          navigate(PAGE_PATHS.PAYMENT.PAYMENT);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        장바구니
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              )}

              {isAuthenticated && isAlertOpen && (
                <AlertDropdown ref={alertRef}>
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <AlertCell
                        key={alert.id}
                        message={alert.message}
                        date={alert.date}
                        onClick={() => handleAlertClick(alert.url)}
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
  );
};

export default Header;
