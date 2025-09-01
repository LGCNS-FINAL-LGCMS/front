import styled from "styled-components";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";

import { checkNicknameAPI, signupAPI } from "../../api/Signup/signupAPI";
import type { UserCategoriesList } from "../../types/authInfo";
import Button from "../../components/Common/Button";
import CategorySelect from "../../components/Signup/CategorySelect";
import InfoCheckModal from "../../components/Signup/signupModal";
import RoleSelect from "../../components/Signup/RoleSelect";
import { setUserInfo } from "../../redux/Auth/authSlice";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0px;
  background-color: ${({ theme }) => theme.colors.background_B};
`;

const UserInfoContainer = styled.div`
  text-align: center;
  width: ${({ theme }) => theme.size.container_S};
  padding: 60px 40px;
  border: 2px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 12px;
  background-color: white;
  font-family: ${({ theme }) => theme.font.primary};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  transition: ${({ theme }) => theme.transition.default};
`;

const TitleSection = styled.div`
  margin-bottom: 40px;
`;

const UserInfoTitle = styled.h1`
  margin: 0;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_D};
  font-family: ${({ theme }) => theme.font.primary};
`;

const NicknameSection = styled.div`
  padding: 10px;
  margin-bottom: 30px;
`;

const NicknameLabel = styled.h3`
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_D};
  font-family: ${({ theme }) => theme.font.primary};
`;

const NicknameInputBox = styled.input`
  width: 200px;
  height: 48px;
  margin: 0 12px 8px 0;
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 8px;
  font-family: ${({ theme }) => theme.font.primary};
  font-size: ${({ theme }) => theme.fontSize.body.max};
  background-color: white;
  color: ${({ theme }) => theme.colors.text_D};
  transition: ${({ theme }) => theme.transition.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray_M};
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-1px);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray_M};
  }
`;

const NicknameCheckMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.small.max};
  color: ${({ theme }) => theme.colors.caution};
  min-height: 20px;
  margin: 4px 0 0 0;
  font-family: ${({ theme }) => theme.font.primary};
  font-weight: 500;
  text-align: center;
  display: block;
  width: 100%;
`;

const CategorySection = styled.div`
  margin-bottom: 30px;
`;
const CategoryTitle = styled.h1`
  text-align: center;
  margin: 20px; // 위아래 간격

  font-size: ${(props) => props.theme.fontSize.title.min};
`;

const CategorySubTitle = styled.p`
  text-align: center;
`;

const RoleSelectSubtitle = styled.p``;

const RoleSection = styled.div`
  margin-bottom: 30px;
`;

const ButtonSection = styled.div`
  margin-top: 20px;
`;

const UpdateUserInfoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth); // 리덕스에서 userInfo가져오기

  const [nickname, setNickname] = useState(userInfo.nickname); // 회원수정 전 기존 닉네임
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복확인 결과 메세지
  const [nicknameCheck, setNicknameCheck] = useState<boolean | null>(null); // 중복확인 여부 확인
  const [isCheckingNickname, setIsCheckingNickname] = useState(false); // api 중복 실행 방지

  const [selectedCategories, setSelectedCategories] = useState<
    UserCategoriesList[]
  >(userInfo.categories); // 선택된 카테고리

  const [selectedRole, setSelectedRole] = useState<boolean | null>(
    userInfo.desireLecturer
  ); // role 선택상태

  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달

  // 닉네임 input
  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameCheckMessage("");
    setNickname(e.target.value);
    setNicknameCheck(null);

    if (nickname === userInfo.nickname) {
      setNicknameCheckMessage("현재 사용중인 닉네임과 같습니다.");
      setNicknameCheck(true);
    }
  };

  //중복버튼 클릭 시
  const checkNickname = async () => {
    if (nickname === "") {
      setNicknameCheckMessage("닉네임을 입력해주세요.");
      setNicknameCheck(null); // 중복확인 다시 눌러야됨
      return;
    }
    if (nickname === userInfo.nickname) {
      setNicknameCheckMessage("현재 사용 중인 닉네임과 같습니다.");
      setNicknameCheck(true);
    }

    if (nickname !== userInfo.nickname) {
      setIsCheckingNickname(true);
      try {
        const result = await checkNicknameAPI(nickname);
        if (result.data.isUsed === true) {
          setNicknameCheck(false);
          setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
          console.log("isUsed: ", result.data.isUsed);
        } else if (result.data.isUsed === false) {
          setNicknameCheckMessage("사용가능한 닉네임입니다.");
          setNicknameCheck(true);
          console.log("isUsed: ", result.data.isUsed);
        }
      } catch (error) {
        console.error("닉네임중복확인 오류:", error);
        setNicknameCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsCheckingNickname(false);
      }
    }
  };

  //카테고리 핸들러
  const handleCategorySelection = useCallback(
    (categories: UserCategoriesList[]) => {
      setSelectedCategories(categories);
    },
    []
  );

  //role 선택 핸들러
  const handleRoleSelection = (getDesireLecturer: boolean | null) => {
    setSelectedRole(getDesireLecturer);
  };

  //회원수정 완료 클릭
  const infoUpdateClick = async () => {
    // 변경사항 확인
    const nicknameChanged = nickname !== userInfo.nickname;
    const categoryChanged =
      JSON.stringify(selectedCategories) !==
      JSON.stringify(userInfo.categories);
    const roleChanged = selectedRole !== userInfo.desireLecturer;

    if (!nicknameChanged && !categoryChanged && !roleChanged) {
      alert("변경된 정보가 없습니다.");
      return;
    }

    if (nicknameChanged) {
      if (nickname === userInfo.nickname) {
        setNicknameCheck(true);
      } else {
        if (nickname.trim() == "") {
          alert("닉네임을 입력해주세요");
          return;
        } else if (nicknameCheck !== true && nickname !== userInfo.nickname) {
          alert("닉네임 중복확인을 해주세요.");
          return;
        }
      }
    }

    if (categoryChanged) {
      // 카테고리 5개이상이면 리스트에 안보냄
      if (selectedCategories.length === 0) {
        alert("카테고리를 다시 선택해주세요.");
        return;
      }
    }

    if (nicknameCheck === true) {
      try {
        const result = await signupAPI(
          nickname,
          selectedCategories,
          selectedRole
        );

        if (result.status === "OK") {
          console.log("서버연결 성공");

          const {
            memberId,
            nickname,
            role,
            desireLecturer: desireLecturer,
            categories,
          } = result.data;

          dispatch(
            setUserInfo({
              memberId: memberId,
              nickname: nickname,
              role: role,
              desireLecturer: desireLecturer,
              categories,
            })
          );
          setShowSuccessModal(true);
        } else {
          setShowFailModal(true);
          console.log("회원가입수정 실패");
        }
      } catch (error) {
        console.error("회원가입수정 서버 오류 : ", error);
      }
    }
    return;
  };

  // 확인 누르면 변경된 회원수정페이지 보여주기
  const handelConfirm = () => {
    setShowSuccessModal(true);
    navigate(PAGE_PATHS.USER_INFO);
    setShowSuccessModal(false);
  };

  //취소 버튼 없어
  const handelCancel = () => {
    setShowFailModal(false);
  };

  return (
    <PageWrapper>
      <UserInfoContainer>
        <TitleSection>
          <UserInfoTitle>회원 정보 수정</UserInfoTitle>
        </TitleSection>

        <NicknameSection>
          <NicknameLabel>닉네임을 입력해주세요.</NicknameLabel>
          <NicknameInputBox
            value={nickname}
            onChange={handleNicknameInput}
            placeholder="Nickname"
          />
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
          <CategoryTitle>Category</CategoryTitle>
          <CategorySubTitle>관심있는 카테고리를 추가하세요.</CategorySubTitle>
          <CategorySelect onCategoryChange={handleCategorySelection} />
        </CategorySection>

        <RoleSection>
          <RoleSelectSubtitle>강사로 전환하시겠습니까?</RoleSelectSubtitle>

          <RoleSelect
            onRoleChange={handleRoleSelection}
            selectedRole={selectedRole}
            styleType="checkbox"
          />
        </RoleSection>

        <ButtonSection>
          <Button
            text="회원정보수정완료"
            onClick={infoUpdateClick}
            design={2}
            fontWeight={400}
          />
        </ButtonSection>

        <InfoCheckModal
          isOpen={showSuccessModal}
          message="회원정보수정이 완료되었습니다."
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
      </UserInfoContainer>
    </PageWrapper>
  );
};

export default UpdateUserInfoPage;
