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

const SignupWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: ${({ theme }) => theme.size.container_S};
  margin: 0 auto;
  padding: 40px;
  border-radius: 12px;
  background-color: white;

  font-family: ${(props) => props.theme.font.primary};
`;

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const SignupTitle = styled.h1`
  margin: 20px;
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.title.max};
  font-weight: 700;
`;

// 닉네임 입력
const NicknameSection = styled.div`
  gap: 10px;
`;

const NicknameLabel = styled.h3`
  font-size: ${(props) => props.theme.fontSize.contents.medium};
`;

const NicknameInputBox = styled.input`
  width: 180px;
  height: 45px;
  margin: 10px; // 위 오른쪽 아래 왼쪽
  padding: 12px 16px;

  border: 1px solid ${(props) => props.theme.colors.gray_L};
  border-radius: 12px;

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
  font-size: ${(props) => props.theme.fontSize.modal.max};
  color: ${(props) => props.theme.colors.caution};
`;

const CategorySection = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CategorySubTitle = styled.span`
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.contents.medium};
`;

const RoleSelectContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const RoleTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSize.contents.medium};
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
        setNicknameCheck(false);
        setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
      } else if (result.data.isUsed === false) {
        setNicknameCheck(true);
        setNicknameCheckMessage("사용가능한 닉네임입니다.");
      }
    } catch {
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
        }
      } catch {
        setShowFailModal(true);
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
    <SignupWrapper>
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

        <CategorySection>
          <CategorySubTitle>관심있는 카테고리를 추가하세요.</CategorySubTitle>
          <CategorySelect onCategoryChange={handleCategorySelection} />
        </CategorySection>

        <RoleSelectContainer>
          <RoleTitle>사용하시는 분이 누구인가요 ?</RoleTitle>
          <RoleSelect
            selectedRole={selectedRole}
            onRoleChange={handleRoleSelection}
          />
        </RoleSelectContainer>

        <Button
          text="회원가입완료"
          onClick={signupClick}
          design={2}
          fontWeight={400}
        />
      </SignupContainer>

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
    </SignupWrapper>
  );
};

export default SignupPage;
