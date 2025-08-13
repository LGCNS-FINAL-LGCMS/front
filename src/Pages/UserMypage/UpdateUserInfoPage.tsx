import styled from "styled-components";
import {
  checkNicknameDuplicate,
  signupAPI,
  type CategoryFormat,
} from "../../api/Signup/signupAPI";
import Button from "../../components/Common/Button";

import { useState } from "react";

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
    </UserInfoContainer>
  );
};

export default UpdateUserInfoPage;
