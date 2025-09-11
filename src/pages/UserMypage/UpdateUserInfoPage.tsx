import styled from "styled-components";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { checkNicknameAPI, signupAPI } from "../../api/Signup/signupAPI";
import { signoutRequest } from "../../api/Auth/authApi";
import type { UserCategoriesList } from "../../types/authInfo";
import Button from "../../components/Common/Button";
import CategorySelect from "../../components/Signup/CategorySelect";
import InfoCheckModal from "../../components/Signup/signupModal";
import RoleSelect from "../../components/Signup/RoleSelect";
import { resetUserInfo, setUserInfo } from "../../redux/Auth/authSlice";
import { theme } from "../../assets/styles/theme";
import { logoutUsingToken } from "../../redux/token/tokenSlice";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 80vh;

  font-family: ${(props) => props.theme.font.primary};
`;

const UserInfoContainer = styled.div`
  width: ${({ theme }) => theme.size.container_S};
  margin: 0 auto;
  padding: 40px;
  border-radius: 12px;
  background-color: white;
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

const NicknameCheckMessage = styled.p`
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

const RoleSection = styled.div`
  gap: 30px;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.background_Overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalContent = styled.div<{ isSuccess: boolean }>`
  background: #fff;
  width: ${({ theme }) => theme.size.modal.width};
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  text-align: center;
  animation: fadeIn 0.3s ${({ theme }) => theme.transition.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h2 {
    font-size: ${({ theme }) => theme.fontSize.title.max};
    color: ${({ isSuccess, theme }) =>
      isSuccess ? theme.colors.success : theme.colors.danger};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    font-size: ${({ theme }) => theme.fontSize.body.max};
    color: ${({ theme }) => theme.colors.text_D};
    margin: 0;
    white-space: pre-line;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.header || "#333"};
  }
`;

const Modal: React.FC<{
  message: string;
  onClose: () => void;
  navigate: () => void;
}> = ({ message, onClose, navigate }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (inputValue !== "탈퇴하겠습니다" || isLoading) return;

    setIsLoading(true);
    try {
      await navigate();
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} isSuccess={false}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="3x"
            color={theme.colors.caution}
          />
        </div>
        <p
          style={{
            fontSize: "1rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {message}
        </p>

        <Input
          type="text"
          placeholder='"탈퇴하겠습니다"를 입력하세요'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <Button
            text={isLoading ? "처리 중..." : "확인"}
            onClick={handleConfirm}
            design={4}
            disabled={inputValue !== "탈퇴하겠습니다" || isLoading}
          />
          <Button
            text="취소"
            onClick={onClose}
            design={2}
            disabled={isLoading}
          />
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
};

const ButtonSection = styled.div``;

const UpdateUserInfoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth); // 리덕스에서 userInfo가져오기

  const [nickname, setNickname] = useState(userInfo.nickname); // 회원수정 전 기존 닉네임
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복확인 결과 메세지
  const [nicknameCheck, setNicknameCheck] = useState<boolean | null>(null); // 중복확인 여부 확인
  const [isCheckingNickname, setIsCheckingNickname] = useState(false); // api 중복 실행 방지
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<
    UserCategoriesList[]
  >(userInfo.categories); // 선택된 카테고리

  const [selectedRole, setSelectedRole] = useState<boolean | null>(
    userInfo.desireLecturer
  ); // role 선택상태

  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [modalMessage, setModalMessage] = useState<string>("");

  // 닉네임 input
  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameCheckMessage("");
    setNickname(e.target.value);
    setNicknameCheck(null);
    setIsCheckingNickname(false);
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
      try {
        const result = await checkNicknameAPI(nickname);
        if (result.data.isUsed === true) {
          setNicknameCheck(false);
          setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
          setIsCheckingNickname(true);
        } else if (result.data.isUsed === false) {
          setNicknameCheck(true);
          setNicknameCheckMessage("사용가능한 닉네임입니다.");
          setIsCheckingNickname(true);
          console.log(result.data.isUsed);
        }
      } catch {
        setNicknameCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
        setNicknameCheck(null);
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
      setModalMessage("변경된 정보가 없습니다.");
      setShowFailModal(true);
      return;
    }
    if (nicknameCheck !== true && nickname !== userInfo.nickname) {
      setModalMessage("닉네임 중복확인을 해주세요.");
      setShowFailModal(true);
      return;
    }
    if (selectedCategories.length === 0) {
      setModalMessage("1개이상의 카테고리를 선택해주세요.");
      setShowFailModal(true);
      return;
    }
    try {
      const result = await signupAPI(
        nickname,
        selectedCategories,
        selectedRole
      );

      if (result.status === "OK") {
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
        setModalMessage("회원 정보 수정이 완료되었습니다.");
        setShowSuccessModal(true);
      } else {
        setModalMessage("오류가 생겼습니다. 다시 시도해주세요.");
        setShowFailModal(true);
      }
    } catch {
      setModalMessage("오류가 생겼습니다. 다시 시도해주세요.");
      setShowFailModal(true);
    }
    return;
  };

  const handleGoHome = () => {
    setShowSuccessModal(true);
    navigate(PAGE_PATHS.HOME);
  };

  const handleUpdateFail = () => {
    setShowFailModal(false);
    navigate(PAGE_PATHS.USER_PAGE.STUDENT.USER_INFO);
  };

  //취소 버튼 없어
  const handleCancel = () => {
    setShowSuccessModal(false);
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
            disabled={isCheckingNickname}
          />
          <NicknameCheckMessage>{nicknameCheckMessage}</NicknameCheckMessage>
        </NicknameSection>

        <CategorySection>
          <CategorySubTitle>관심있는 카테고리를 추가하세요.</CategorySubTitle>
          <CategorySelect onCategoryChange={handleCategorySelection} />
        </CategorySection>

        <RoleSection>
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
        <Button
          text="회원 탈퇴"
          onClick={() => setShowSignOutModal(true)}
          design={4}
          fontWeight={400}
        />
      </UserInfoContainer>

      <InfoCheckModal
        isOpen={showSuccessModal}
        message={modalMessage}
        onConfirm={handleGoHome}
        onCancel={handleCancel}
        confirmText="확인"
      />

      <InfoCheckModal
        isOpen={showFailModal}
        message={modalMessage}
        onConfirm={handleUpdateFail}
        onCancel={handleCancel}
        confirmText="확인"
      />

      {showSignOutModal && (
        <Modal
          message={`정말로 회원 탈퇴를 진행하시겠습니까?\n탈퇴하려면 '탈퇴하겠습니다'를 입력하세요.`}
          onClose={() => setShowSignOutModal(false)}
          navigate={async () => {
            try {
              const response = await signoutRequest();
              if (response.status !== "OK") throw new Error("탈퇴 실패");
              await dispatch(logoutUsingToken()).unwrap();
              dispatch(resetUserInfo());
            } catch {
              setModalMessage("탈퇴 중 오류가 발생했습니다.");
              setShowFailModal(true);
            }
          }}
        />
      )}
    </PageWrapper>
  );
};

export default UpdateUserInfoPage;
