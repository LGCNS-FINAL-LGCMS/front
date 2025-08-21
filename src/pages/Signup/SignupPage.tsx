import styled from "styled-components";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";

import Button from "../../components/Common/Button";
import RoleSelect from "../../components/Signup/RoleSelect";
import CategorySelect from "../../components/Signup/CategorySelect";
import InfoCheckModal from "../../components/Signup/signupModal";
import { checkNicknameAPI, signupAPI } from "../../api/Signup/signupAPI";
import type { UserCategoriesList } from "../../types/authInfo";
import { setUserInfo } from "../../redux/Auth/authSlice";

const SignupContainer = styled.div`
  text-align: center;
  width: ${({ theme }) => theme.size.container_S};
  margin: 10px auto; // 위 오른쪽 아래 왼쪽
  padding: 60px 40px;
  border: 2px solid;
  border-radius: 8px;
  background-color: white;

  font-family: ${(props) => props.theme.font.primary};
`;

const SignupTitle = styled.h1`
  margin: 10px 0 40px 0; // 위 오른쪽 아래 왼쪽

  text-align: center;
  font-size: ${(props) => props.theme.fontSize.title.max};
  font-weight: 700;
`;

// 닉네임 입력
const NicknameSection = styled.div`
  padding: 10px;
`;

const NicknameLabel = styled.h3`
  margin-bottom: 30px;

  font-size: ${(props) => props.theme.fontSize.small};
`;

const NicknameInputBox = styled.input`
  width: 180px;
  height: 45px;
  margin: 0 10px 20px 0; // 위 오른쪽 아래 왼쪽
  padding: 12px 16px;

  border: 1px solid ${(props) => props.theme.colors.gray_L};
  border-radius: 8px;

  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.button.min};

  background-color: white;
  color: ${(props) => props.theme.colors.gray_D};

  &::placeholder {
    color: ${(props) => props.theme.colors.gray_M};
    font-weight: 400;
  }
  &:focus {
    outline: none; /* 기본 파란 테두리 제거 */
    border-color: ${(props) => props.theme.colors.gray_D}; /* 파란색 테두리 */
    box-shadow: ${(props) => props.theme.shadow.md};
  }
`;

const NicknameCheckMessage = styled.div`
  font-size: ${(props) => props.theme.fontSize.small.max};
  color: ${(props) => props.theme.colors.caution};
  min-height: 20px;
  padding-left: 4px;
`;

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [nickname, setNickname] = useState(""); //input에서 받은 nickname
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복확인 결과 메세지
  const [nicknameCheck, setNicknameCheck] = useState<boolean | null>(null); // 중복확인버튼 눌렀는지 아닌지(로컬에서)
  const [isCheckingNickname, setIsCheckingNickname] = useState(false); // api 중복 실행 방지

  const [selectedCategories, setSelectedCategories] = useState<
    UserCategoriesList[]
  >([]); // 선택된 카테고리

  const [selectedRole, setSelectedRole] = useState<boolean | null>(null); // role 선택상태

  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달

  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameCheck(null); // input 바뀌면 중복확인 다시해야됨
    setNicknameCheckMessage("");
  };

  //중복버튼 클릭 시
  const checkNickname = async () => {
    if (nickname === "") {
      setNicknameCheckMessage("닉네임을 입력해주세요.");
      setNicknameCheck(null); // 중복확인 다시 눌러야됨
      return;
    }

    setIsCheckingNickname(true);

    try {
      const result = await checkNicknameAPI(nickname);
      if (result.data.isUsed === true) {
        console.log("사용중인 닉네임", result.data.isUsed);
        setNicknameCheck(false);
        setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
      } else if (result.data.isUsed === false) {
        setNicknameCheck(true);
        console.log("사용안하고 있는 닉네임", result.data.isUsed);
        setNicknameCheckMessage("사용가능한 닉네임입니다.");
      }
    } catch (error) {
      console.error("중복확인 오류:", error);
      setNicknameCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  //카테고리 핸들러
  const handleCategorySelection = useCallback(
    (categories: UserCategoriesList[]) => {
      setSelectedCategories(categories);
    },
    []
  );

  // role 선택 핸들러
  const handleRoleSelection = (desireLecturer: boolean | null) => {
    setSelectedRole(desireLecturer);
  };

  const signupClick = async () => {
    if (nickname.trim() === "") {
      alert("닉네임을 입력해주세요");
      return;
    } else if (nicknameCheck === null) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    } else if (nicknameCheck === false) {
      alert("사용할 수 없는 닉네임입니다.");
      return;
    } else if (selectedCategories.length === 0) {
      alert("카테고리가 많거나 없습니다.");
      return;
    } else if (selectedRole === null) {
      alert("사용자 역할을 선택해주세요.");
      return;
    } else if (nicknameCheck === true) {
      try {
        const result = await signupAPI(
          nickname,
          selectedCategories,
          selectedRole
        );

        if (result.status === "OK") {
          console.log("서버연결 성공");
          const { memberId, nickname, role, desireLecturer, categories } =
            result.data;

          dispatch(
            setUserInfo({
              memberId: memberId,
              nickname: nickname,
              role: role,
              desireLecturer: desireLecturer,
              categories,
            })
          );
          setNicknameCheck(true);
          setShowSuccessModal(true);
        } else {
          setShowFailModal(true);
          setNicknameCheck(false);
          console.log("회원가입 실패");
        }
      } catch (error) {
        console.error("회원가입 서버 오류 : ", error);
      }
      return;
    }
  };

  // 확인 누르면 메인으로
  const handelConfirm = () => {
    setShowSuccessModal(false);
    navigate(PAGE_PATHS.HOME);
  };

  //취소 누르면 로그인 페이지로
  const handelCancel = () => {
    setShowFailModal(false);
    navigate(PAGE_PATHS.LOGIN);
  };

  return (
    <SignupContainer>
      <SignupTitle>회원가입</SignupTitle>
      <NicknameSection>
        <NicknameLabel>닉네임을 입력해주세요.</NicknameLabel>
        <NicknameInputBox
          value={nickname}
          onChange={handleNicknameInput}
          placeholder="nickname"
        ></NicknameInputBox>
        <Button
          text="중복확인"
          onClick={checkNickname}
          design={3}
          fontWeight={400}
          disabled={isCheckingNickname}
        />
        <NicknameCheckMessage>{nicknameCheckMessage}</NicknameCheckMessage>
      </NicknameSection>
      <CategorySelect onCategoryChange={handleCategorySelection} />

      <RoleSelect
        selectedRole={selectedRole}
        onRoleChange={handleRoleSelection}
      />
      <Button
        text="회원가입완료"
        onClick={signupClick}
        design={2}
        fontWeight={400}
      />

      <InfoCheckModal
        isOpen={showSuccessModal}
        message="회원가입을 축하드립니다."
        onConfirm={handelConfirm}
        onCancel={handelConfirm}
        confirmText="확인"
      />

      <InfoCheckModal
        isOpen={showFailModal}
        message="회원가입에 실패했습니다."
        onConfirm={handelCancel}
        onCancel={handelCancel}
        confirmText="확인"
      />
    </SignupContainer>
  );
};

export default SignupPage;
