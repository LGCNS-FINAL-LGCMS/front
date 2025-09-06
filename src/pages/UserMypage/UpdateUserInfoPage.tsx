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
import SideTab from "../../components/Common/SideTab";

const PageWrapper = styled.div`
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

const UserInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const TitleSection = styled.div`
  margin: 20px;
`;

const UserInfoTitle = styled.h1`
  margin: 0;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_D};
  font-family: ${({ theme }) => theme.font.primary};
`;

const NicknameSection = styled.div``;

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

const NicknameCheckMessage = styled.p`
  font-size: ${(props) => props.theme.fontSize.small.max};
  color: ${(props) => props.theme.colors.caution};
`;

const CategorySection = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CategoryTitle = styled.span`
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.title.min};
`;

const CategorySubTitle = styled.span`
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.contents.medium};
`;

const RoleSection = styled.div`
  gap: 30px;
`;

const RoleSelectSubtitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.contents.medium};
`;

const ButtonSection = styled.div``;

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
    navigate(PAGE_PATHS.HOME);
  };

  //취소 버튼 없어
  const handelCancel = () => {
    setShowFailModal(false);
  };

  //sideTab
  const tabItems = [
    {
      id: 1,
      label: "My Lecture",
      action: () => navigate(PAGE_PATHS.USER_PAGE.STUDENT.MY_LECTURES),
    },
    {
      id: 2,
      label: "Level Test",
      action: () => navigate(PAGE_PATHS.LEVEL_TEST.DASHBOARD),
    },
    {
      id: 3,
      label: "회원정보수정",
      action: () => navigate(PAGE_PATHS.USER_PAGE.STUDENT.USER_INFO),
    },
    {
      id: 4,
      label: "나의 Q&A",
      action: () => navigate(PAGE_PATHS.USER_PAGE.STUDENT.QNA),
    },
  ];

  const handleTabSelect = (id: number) => {
    const tab = tabItems.find((t) => t.id === id);
    if (tab?.action) tab.action();
  };

  return (
    <PageWrapper>
      <SideTab title="MyPage" items={tabItems} onSelect={handleTabSelect} />
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
      </UserInfoContainer>

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
    </PageWrapper>
  );
};

export default UpdateUserInfoPage;
