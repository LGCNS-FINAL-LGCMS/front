import styled from "styled-components";
import { useState } from "react";
import Button from "../../components/Common/Button";

const SignupContainer = styled.div`
  width: "600px";
  margin: 0 auto; // 좌우 중앙 정렬 (0: 위아래,  auto는 좌우)
  padding: 40px;
  border: 1px solid;
  border-radius: 8px;
  background-color: white;
`;

const SignupTitle = styled.h1`
  text-align: center;
  margin: 10px; // 위아래 간격
`;

// 닉네임 입력
const NicknameSection = styled.div`
  text-align: left;
  margin-bottom: 20px;
`;

const NicknameLabel = styled.h3`
  text-align: left;
  margin-bottom: 10px;
`;

const NicknameInputBox = styled.input`
  border: 1px solid; // 색상 변경
  border-radius: 4px;
  width: 180px;

  margin-right: 10px;
`;

const CheckMessage = styled.div``;

const SignupPage = () => {
  const [nickname, setNickname] = useState(""); //input에서 받은 nickname
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복확인 결과 메세지
  const [nicknameOK, setNicknameOK] = useState<boolean | null>(null); // 회원가입완료 시 중복확인 검사

  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameOK(null); // input 바뀌면 중복확인 다시해야됨
    setNicknameCheckMessage("");
  };

  // 닉네임API
  const checkNicknameDuplicate = async (nickname: string) => {
    try {
      const response = await fetch("/api/auth/check-nickname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("호출 실패 -> 더미데이터", error);
      if (nickname == "test") {
        return { status: "OK", data: { isDuplicate: true } };
      } else {
        return { status: "OK", data: { isDuplicate: false } };
      }
    }
  };

  const checkNickname = async () => {
    if (nickname == "") {
      setNicknameCheckMessage("닉네임을 입력해주세요.");
      return;
    } else {
      try {
        const result = await checkNicknameDuplicate(nickname);
        if (result.data.isDuplicate == true) {
          setNicknameOK(true);
          setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
        } else if (result.data.isDuplicate == false) {
          setNicknameOK(false);
          setNicknameCheckMessage("사용가능한 닉네임입니다.");
        }
      } catch (error) {
        console.error("중복확인 오류:", error);
        setNicknameCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  //회원가입 api
  const signupResponse = async (nickname: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname.trim(),
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("호출 실패 -> 더미데이터", error);
      return { status: "OK", data: { nickname: nickname } };
      // return { status: "LEC-13", data: null };
    }
  };

  const signupClick = async () => {
    if (nickname.trim() == "") {
      alert("닉네임을 입력해주세요");
      return;
    } else if (nicknameOK == null) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    } else if (nicknameOK == true) {
      alert("사용할 수 없는 닉네임입니다.");
      return;
    } else if (nicknameOK == false) {
      try {
        const result = await signupResponse(nickname);
        if (result.status == "OK") {
          alert("회원가입완료");
          console.log(nickname);
        } else {
          alert("회원가입 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("회원가입 오류 : ", error);
      }
      return;
    }
  };

  return (
    <SignupContainer>
      <SignupTitle>회원가입</SignupTitle>
      <NicknameSection>
        <NicknameLabel>닉네임을 입력해주세요.</NicknameLabel>
        <NicknameInputBox
          value={nickname}
          onChange={handleNicknameInput}
        ></NicknameInputBox>
        <Button text="중복확인" onClick={checkNickname} />
        <CheckMessage>{nicknameCheckMessage}</CheckMessage>
      </NicknameSection>
      <Button text="회원가입완료" onClick={signupClick} />
    </SignupContainer>
  );
};

export default SignupPage;
