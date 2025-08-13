import styled from "styled-components";
import {
  checkNicknameDuplicate,
  signupAPI,
  type CategoryFormat,
} from "../../api/Signup/signupAPI";
import Button from "../../components/Common/Button";

import { useState, useCallback } from "react";
import CategorySelect from "../../components/Signup/CategorySelect";

const UserInfoContainer = styled.div`
  font-family: ${(props) => props.theme.font.primary};
`;

const UserInfoTitle = styled.h1``;

const NicknameSection = styled.div``;

const NicknameLabel = styled.h3``;

const NicknameInputBox = styled.input``;

const NicknameCheckMessage = styled.p``;

const UpdateUserInfoPage = () => {
  const [nickname, setNickname] = useState(""); //input에서 받은 nickname
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복확인 결과 메세지
  const [nicknameCheck, setNicknameCheck] = useState<boolean | null>(null); // 수정완료 시 중복확인 검사여부
  const [lastNickname, setLastNickname] = useState(""); // api중복으로 안보내게

  const [selectedCategories, setSelectedCategories] = useState<
    CategoryFormat[]
  >([]); // 선택된 카테고리

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
      return;
    } // 마지막 쓴 nickname과 같고, 체크도 되어있을 때
    if (nickname === lastNickname && nicknameCheck !== null) {
      setNicknameCheckMessage(
        nicknameCheck
          ? "사용가능한 닉네임입니다."
          : "사용할 수 없는 닉네임입니다."
      );
      return;
    }
    try {
      const result = await checkNicknameDuplicate(nickname);
      console.log(result.data.isUsed);
      setLastNickname(nickname);
      if (result.data.isUsed === false) {
        setNicknameCheck(false);
        setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
      } else if (result.data.isUsed === true) {
        setNicknameCheck(true);
        setNicknameCheckMessage("사용가능한 닉네임입니다.");
      }
    } catch (error) {
      console.error("중복확인 오류:", error);
      setNicknameCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  //카테고리 핸들러
  const handleCategorySelection = useCallback(
    (categories: CategoryFormat[]) => {
      setSelectedCategories(categories);
    },
    []
  );

  //회원가입 완료 클릭
  const InfoUpdateClick = async () => {
    if (nickname.trim() == "") {
      alert("닉네임을 입력해주세요");
      return;
    } else if (nicknameCheck === null) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    } else if (nicknameCheck === false) {
      alert("사용할 수 없는 닉네임입니다.");
    } else if (selectedCategories.length === 0) {
      alert("관심있는 카테고리를 선택해주세요.");
    }
  };

  return (
    <UserInfoContainer>
      <UserInfoTitle></UserInfoTitle>
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
        />
        <NicknameCheckMessage>{nicknameCheckMessage}</NicknameCheckMessage>
      </NicknameSection>

      <CategorySelect onCategoryChange={handleCategorySelection} />

      <Button
        text="회원정보수정완료"
        onClick={InfoUpdateClick}
        design={2}
        fontWeight={400}
      />
    </UserInfoContainer>
  );
};

export default UpdateUserInfoPage;
