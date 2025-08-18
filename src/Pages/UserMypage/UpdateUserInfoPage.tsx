import styled from "styled-components";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";

import { checkNicknameAPI, signupAPI } from "../../api/Signup/signupAPI";
import type { UserCategoriesList } from "../../types/authInfo";
import Button from "../../components/Common/Button";
import CategorySelect from "../../components/Signup/CategorySelect";
import InfoCheckModal from "../../components/Signup/signupModal";
import RoleSelect from "../../components/Signup/RoleSelect";
import { setUserInfo } from "../../redux/Auth/authSlice";

const UserInfoContainer = styled.div`
  font-family: ${(props) => props.theme.font.primary};
`;

const UserInfoTitle = styled.h1``;

const NicknameSection = styled.div``;

const NicknameLabel = styled.h3``;

const NicknameInputBox = styled.input``;

const NicknameCheckMessage = styled.p``;

const UpdateUserInfoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(""); //input에서 받은 nickname
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복확인 결과 메세지
  const [nicknameCheck, setNicknameCheck] = useState<boolean | null>(null); // 중복확인 여부 확인
  const [lastNickname, setLastNickname] = useState(""); // api중복으로 안보내게

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
    setLastNickname("");
  };

  //중복버튼 클릭 시
  const checkNickname = async () => {
    if (nickname === "") {
      setNicknameCheckMessage("닉네임을 입력해주세요.");
      setNicknameCheck(null); // 중복확인 다시 눌러야됨
      return;
    }
    // 중복확인 연속 클릭 불가
    if (nickname === lastNickname) {
      setNicknameCheck(null);
      return;
    }
    try {
      const result = await checkNicknameAPI(nickname);
      setLastNickname(nickname);
      if (result.data.isUsed === true) {
        setNicknameCheck(false);
        setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
        console.log("isUsed: ", result.data.isUsed);
      } else if (result.data.isUsed === false) {
        setNicknameCheck(true);
        setNicknameCheckMessage("사용가능한 닉네임입니다.");
        console.log("isUsed: ", result.data.isUsed);
      }
    } catch (error) {
      console.error("닉네임중복확인 오류:", error);
      setNicknameCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
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

  //회원가입 완료 클릭
  const infoUpdateClick = async () => {
    if (nickname.trim() == "") {
      alert("닉네임을 입력해주세요");
      return;
    } else if (nicknameCheck === null) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    } else if (nicknameCheck === false) {
      alert("사용할 수 없는 닉네임입니다.");
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

          const { memberId, nickname, role, getDesireLecturer, categories } =
            result.data;

          dispatch(
            setUserInfo({
              memberId: memberId,
              nickname: nickname,
              role: role,
              getDesireLecturer: getDesireLecturer,
              categories,
            })
          );
          setNicknameCheck(true);
          setShowSuccessModal(true);
        } else {
          setShowFailModal(true);
          setNicknameCheck(false);
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
    <UserInfoContainer>
      <UserInfoTitle></UserInfoTitle>
      <NicknameSection>
        <NicknameLabel>닉네임을 입력해주세요.</NicknameLabel>
        <NicknameInputBox
          value={nickname}
          onChange={handleNicknameInput}
          placeholder={nickname}
        ></NicknameInputBox>

        <Button
          text="중복확인"
          onClick={checkNickname}
          design={3}
          fontWeight={400}
        />
        <NicknameCheckMessage>{nicknameCheckMessage}</NicknameCheckMessage>
      </NicknameSection>

      <CategorySelect onCategoryChange={handleCategorySelection} />
      <RoleSelect
        onRoleChange={handleRoleSelection}
        selectedRole={selectedRole}
        styleType="checkbox"
      />

      <Button
        text="회원정보수정완료"
        onClick={infoUpdateClick}
        design={2}
        fontWeight={400}
      />

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
  );
};

export default UpdateUserInfoPage;
