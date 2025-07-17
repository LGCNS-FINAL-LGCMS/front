import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/imgs/cms.png";
import { useSelector, useDispatch } from "react-redux";
import useMobileDetect from "../../hook/useMobileDetect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faBars,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
// import { logoutUsingToken } from "../../redux/Token/tokenSlice";
// import { logout } from "../../redux/auth/authSlice";

const HEADER_HEIGHT = "70px";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onNavigate = (url) => navigate(url);
  const onLogout = () => {
    dispatch(logoutUsingToken());
    dispatch(logout());
    navigate("/");
  };
  const handleLogoClick = () => navigate("/");
  const isAuthenticated = false; //useSelector((state) => state.token.isAuthenticated);
  const nickname = "형균"; //useSelector((state) => state.auth.usernickName);
  const isMobile = useMobileDetect();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow h-[70px] "
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="relative flex items-center justify-center h-full max-w-screen-xl mx-auto">
        {/* 로고 - 중앙 */}
        <div
          className="absolute flex items-center gap-2 transform -translate-x-1/2 cursor-pointer left-1/2 hover:text-blue-500"
          onClick={handleLogoClick}
        >
          <img src={Logo} alt="logo" className="h-[65px]" />
          {/* <span className="text-xl font-bold">LGCMS</span> */}
        </div>

        {/* 사용자 액션 - 우측 */}
        <div
          className="absolute right-0 flex items-center gap-4"
          ref={dropdownRef}
        >
          {isAuthenticated ? (
            <>
              {/* 드롭다운 토글 버튼 */}
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-2 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-100"
              >
                {isMobile ? (
                  <FontAwesomeIcon icon={faBars} size="lg" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{nickname}님 환영합니다</span>
                  </>
                )}
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border rounded-md shadow-xl top-full">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    로그아웃
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("/userinfo");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    마이 페이지
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 m-4 text-sm font-semibold text-white transition rounded-sm bg-primary hover:bg-secondary"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export { HEADER_HEIGHT };
export default Header;
