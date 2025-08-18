import styled from "styled-components";
import studentImage from "../../assets/images/selectedStudent.png";
import teacherImage from "../../assets/images/selectedTeacher.png";

const RollSection = styled.div``;

const RoleCardType = styled.div`
  padding: 10px;
  text-align: center;
  margin-bottom: 30px;
`;

const RoleTitle = styled.h2`
  margin-bottom: 30px;

  font-size: ${(props) => props.theme.fontSize.subtitle};
`;

const RoleOptionContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
`;

const RoleOption = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: column; // 아이콘과 라벨을 세로로 배치
  align-items: center;
  justify-content: center;

  //카드
  width: 150px;
  height: 150px;
  padding: 15px;

  background-color: ${(props) =>
    props.selected ? props.theme.colors.gray_L : "white"};
  border: 2px solid
    ${(props) =>
      props.selected ? props.theme.colors.gray_L : props.theme.colors.gray_L};
  border-radius: 12px;
  box-shadow: ${(props) => (props.selected ? props.theme.shadow.lg : "none")};

  cursor: pointer;
  transition: ${(props) => props.theme.transition.default};

  &:hover {
    border-color: ${(props) => props.theme.colors.gray_L};
    box-shadow: ${(props) => props.theme.shadow.md};
  }
`;

const RoleIcon = styled.div<{ selected?: boolean }>`
  //이미지 크기
  width: 80px;
  height: 80px;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain; // 이미지 비율 유지하면서 박스에 맞춤
    // 선택됐을 때 살짝 밝게
    filter: ${(props) =>
      props.selected ? "brightness(1.1) contrast(1.1)" : "none"};
    transition: filter 0.3s ease;
  }
`;

const RoleLabel = styled.div<{ selected?: boolean }>`
  font-size: ${(props) => props.theme.fontSize.body.min};
`;

const RoleCheckMessage = styled.div`
  text-align: center;
  margin: 0 0 10px 0; /* 위 0, 오른쪽 0, 아래 40px, 왼쪽 0 */

  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.body.min};
  color: ${(props) => props.theme.colors.caution};
  font-weight: 400;
  margin-top: 10px;
  min-height: 20px; /* 텍스트 공간 확보 */
`;

//체크박스 스타일 컴포넌트

const RoleCheckBoxType = styled.div`
  padding: 20px;
  text-align: center;
`;

const CheckBoxTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.subtitle};
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 15px;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin: 0;
    accent-color: ${(props) => props.theme.colors.primary};
  }
  label {
    font-size: ${(props) => props.theme.fontSize.body.min};
    cursor: pointer;
    user-select: none;
    color: ${(props) => props.theme.colors.text_D};
    font-weight: 500;
  }
`;

interface RoleSelectProps {
  onRoleChange: (getDesireLecturer: boolean | null) => void;
  selectedRole: boolean | null;
  styleType?: "card" | "checkbox";
}

const RoleSelect = ({
  onRoleChange,
  selectedRole,
  styleType = "card",
}: RoleSelectProps) => {
  const handleRoleSelect = (roleType: string) => {
    if (roleType === "student") {
      onRoleChange(false);
      console.log("학생 선택됨: false");
    } else if (roleType === "teacher") {
      onRoleChange(true);
      console.log("강사 선택됨:true ");
    }
  };

  const hadleCheckboxRoleSelect = () => {
    if (selectedRole === true) {
      onRoleChange(false);
      console.log("여전히 학생임");
    } else {
      onRoleChange(true);
      console.log("강사희망함");
    }
  };

  const getDescriptionText = () => {
    if (styleType === "checkBox") {
      if (selectedRole === true) {
        return "관리자의 확인 후 강사가 됩니다.";
      }
      return;
    } else {
      if (selectedRole === false) {
        return "LG CMS와 원하는 스택을 키워보세요.";
      } else if (selectedRole === true) {
        return "수강생으로 가입된 뒤 관리자의 확인 후 강사가 됩니다 ! ";
      }
      return "";
    }
  };

  return (
    <RollSection>
      {styleType === "checkbox" && (
        <RoleCheckBoxType>
          <CheckBoxTitle></CheckBoxTitle>
          <CheckBoxContainer>
            <input
              type="checkbox"
              id="lecturerDesire"
              checked={selectedRole === true}
              onChange={hadleCheckboxRoleSelect}
            />
            <label htmlFor="lecturerDesire">강사로 진학하기 ✨</label>
          </CheckBoxContainer>
        </RoleCheckBoxType>
      )}

      {styleType === "card" && (
        <RoleCardType>
          <RoleTitle>사용하시는 분이 누구인가요 ?</RoleTitle>
          <RoleOptionContainer>
            <RoleOption
              selected={selectedRole == false}
              onClick={() => handleRoleSelect("student")}
            >
              <RoleIcon selected={selectedRole === false}>
                {" "}
                <img src={studentImage} alt="학생" />
              </RoleIcon>
              <RoleLabel selected={selectedRole === false}>학생</RoleLabel>
            </RoleOption>

            <RoleOption
              selected={selectedRole == true}
              onClick={() => handleRoleSelect("teacher")}
            >
              <RoleIcon selected={selectedRole === true}>
                {" "}
                <img src={teacherImage} alt="선생님" />
              </RoleIcon>
              <RoleLabel selected={selectedRole === true}>선생님</RoleLabel>
            </RoleOption>
          </RoleOptionContainer>
          <RoleCheckMessage>{getDescriptionText()}</RoleCheckMessage>
        </RoleCardType>
      )}
    </RollSection>
  );
};

export default RoleSelect;
