import { useState, useRef } from "react";
import {
  SigninBoxContainer,
  SigninBoxTitle,
  SigninBoxNickname,
  SigninBoxCategory,
  SigninButton,
  Input,
  Deletebutton,
  CategorySelect,
  CheckButton,
  CheckMessage,
} from "./SigninBox.style";

const mockNicknameData = ["김철수", "박영희", "코딩왕", "개발자123"];

const mockMajorData = [
  {
    name: "개발",
    id: 1,
  },
  {
    name: "디자인",
    id: 2,
  },
  {
    name: "마케팅",
    id: 3,
  },
];
const mockMiddleData = [
  {
    name: "프론트",
    id: 1,
  },
  {
    name: "백엔드",
    id: 2,
  },
  {
    name: "데이터",
    id: 3,
  },
];

const mockMinorData = [
  {
    name: "프론트",
    id: 1,
  },
  {
    name: "백엔드",
    id: 2,
  },
  {
    name: "데이터",
    id: 3,
  },
];

const SigninBox = () => {
  const [nickname, setNickname] = useState("");
  const [categoryBox, setCategoryBox] = useState([
    {
      id: 1,
      major: "",
      middle: "",
      minor: "",
    },
  ]);
  const newIdRef = useRef(2);

  const [checkMessage, setCheckMessage] = useState("");
  const [isNicknameOK, setIsNicknameOK] = useState(false);

  const checkNickname = () => {
    if (nickname === "") {
      setCheckMessage("닉네임을 입력해주세요.");
      setIsNicknameOK(false);
      return;
    }

    const isDuplicate = mockNicknameData.includes(nickname);

    if (isDuplicate) {
      setCheckMessage("이미 사용중인 닉네임입니다.");
      setIsNicknameOK(false);
    } else {
      setCheckMessage("사용가능한 아이디 입니다.");
      setIsNicknameOK(true);
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setCheckMessage("");
    setIsNicknameOK(false);
  };

  //대분류
  const updateMajor = (setId: number, value: string) => {
    setCategoryBox(
      categoryBox.map((set) => {
        if (set.id !== setId) return set;

        return {
          ...set,
          major: value,
          middle: "",
          minor: "",
        };
      })
    );
  };

  //중분류
  const updateMiddle = (setId: number, value: string) => {
    setCategoryBox(
      categoryBox.map((set) => {
        if (set.id !== setId) return set;

        return {
          ...set,
          middle: value,
          minor: "",
        };
      })
    );
  };

  //소분류
  const updateMinor = (setId: number, value: string) => {
    setCategoryBox(
      categoryBox.map((set) => {
        if (set.id !== setId) return set;

        return {
          ...set,
          minor: value,
        };
      })
    );
  };

  //카테고리 추가 버튼 클릭 시
  const addCategory = () => {
    setCategoryBox([
      ...categoryBox,
      { id: newIdRef.current, major: "", middle: "", minor: "" },
    ]);

    newIdRef.current += 1;
  };

  //카테고리 삭제
  const deleteCategory = (setId: number) => {
    if (categoryBox.length <= 1) {
      alert("최소 1개 이상의 카테고리를 선택해주세요.");
      return;
    }
    setCategoryBox(categoryBox.filter((set) => set.id !== setId));
  };

  return (
    <SigninBoxContainer>
      <SigninBoxTitle>회원가입</SigninBoxTitle>
      <SigninBoxNickname>
        <h3>닉네임을 입력해주세요.</h3>
        <Input
          type="text"
          placeholder="nickname"
          value={nickname}
          onChange={handleNicknameChange}
        />
        <CheckButton onClick={checkNickname}>중복확인</CheckButton>
        {checkMessage && (
          <CheckMessage
            style={{
              color: isNicknameOK ? "green" : "red",
            }}
          >
            {checkMessage}
          </CheckMessage>
        )}
      </SigninBoxNickname>
      <SigninBoxCategory>
        <h2>Category</h2>
        <h3>관심있는 카테고리를 선택하세요.</h3>
        <CategorySelect>
          {categoryBox.map((set) => (
            <div key={set.id}>
              {/* 대분류 */}
              <div>
                <select
                  value={set.major}
                  onChange={(e) => updateMajor(set.id, e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {mockMajorData.map((major) => (
                    <option key={major.id} value={major.name}>
                      {major.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* 중분류 */}
              <div>
                <select
                  value={set.middle}
                  onChange={(e) => updateMiddle(set.id, e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {mockMiddleData.map((middle) => (
                    <option key={middle.id} value={middle.name}>
                      {middle.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* 소분류 */}
              <div>
                <select
                  value={set.minor}
                  onChange={(e) => updateMinor(set.id, e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {mockMinorData.map((minor) => (
                    <option key={minor.id} value={minor.name}>
                      {minor.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="add-button" onClick={addCategory}>
                +
              </button>
              <Deletebutton onClick={() => deleteCategory(set.id)}>
                삭제
              </Deletebutton>
            </div>
          ))}
        </CategorySelect>{" "}
      </SigninBoxCategory>
      <SigninButton>회원가입완료</SigninButton>
    </SigninBoxContainer>
  );
};

export default SigninBox;
