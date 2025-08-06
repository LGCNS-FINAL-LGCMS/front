import styled from "styled-components";
import { useCallback, useState } from "react";
import Button from "../../components/Common/Button";
import RoleSelect from "../../components/Signup/RoleSelect";
import CategorySelect from "../../components/Signup/CategorySelect";
import {
  checkNicknameDuplicate,
  signupAPI,
  type CategoryFormat,
} from "../../api/Signup/signupAPI";

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

const NicknameCheckMessage = styled.div``;

const SignupPage = () => {
  const [nickname, setNickname] = useState(""); //input에서 받은 nickname
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(""); // 중복확인 결과 메세지
  const [nicknameOK, setNicknameOK] = useState<boolean | null>(null); // 회원가입완료 시 중복확인 검사

  const [selectedCategories, setSelectedCategories] = useState<
    CategoryFormat[]
  >([]);
  const [selectedRole, setSelectedRole] = useState<boolean | null>(null); // role 선택상태

  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameOK(null); // input 바뀌면 중복확인 다시해야됨
    setNicknameCheckMessage("");
  };

  const checkNickname = async () => {
    if (nickname == "") {
      setNicknameCheckMessage("닉네임을 입력해주세요.");
      return;
    } else {
      try {
        const result = await checkNicknameDuplicate(nickname);

        if (result.data.isUsed == true) {
          setNicknameOK(true);
          setNicknameCheckMessage("사용할 수 없는 닉네임입니다.");
        } else if (result.data.isUsed == false) {
          setNicknameOK(false);
          setNicknameCheckMessage("사용가능한 닉네임입니다.");
        }
      } catch (error) {
        console.error("중복확인 오류:", error);
        setNicknameCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  //카테고리 핸들러
  const hadleCategoriesChange = useCallback((categories: CategoryFormat[]) => {
    setSelectedCategories(categories);
    console.log("선택된 카테고리 :", categories);
  }, []);

  // role 선택 핸들러
  const handleRoleChange = (wantTeacher: boolean | null) => {
    setSelectedRole(wantTeacher);
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
    } else if (selectedCategories.length == 0) {
      alert("관심있는 카테고리를 선택해주세요.");
      return;
    } else if (selectedRole == null) {
      alert("사용자 역할을 선택해주세요.");
      return;
    } else if (nicknameOK == false) {
      try {
        const result = await signupAPI(
          nickname,
          selectedCategories,
          selectedRole
        );
        if (result.status == "OK") {
          alert("회원가입완료");
          console.log(nickname, selectedCategories, selectedRole);
        } else {
          alert("회원가입 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("회원가입 서버 오류 : ", error);
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
        <NicknameCheckMessage>{nicknameCheckMessage}</NicknameCheckMessage>
      </NicknameSection>
      <CategorySelect onCategoryChange={hadleCategoriesChange} />
      <RoleSelect selectedRole={selectedRole} onRoleChange={handleRoleChange} />
      <Button text="회원가입완료" onClick={signupClick} />
    </SignupContainer>
  );
};

export default SignupPage;
