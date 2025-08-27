import styled from "styled-components";
import studentImage from "../../assets/images/selectedStudent.png";
import teacherImage from "../../assets/images/selectedTeacher.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const RollSection = styled.div``;

const RoleCardContainer = styled.div`
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
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
  width: 80px;
  height: 80px;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
  margin: 0 0 10px 0;

  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.body.min};
  color: ${(props) => props.theme.colors.caution};
  font-weight: 400;
  margin-top: 10px;
  min-height: 20px;
`;

// 체크박스 컨테이너
const CheckboxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-bottom: 30px;
  padding: 20px;
  border: 1.5px solid #ccc;
  border-radius: 8px;
  width: 250px;
  height: 70px;
`;

// 숨겨진 실제 체크박스
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

// 체크박스
const CustomCheckbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => props.theme.colors.disable};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: white;

  &::after {
    content: "✓";
    font-size: 14px;
    color: ${(props) => props.theme.colors.gray_D};
    opacity: ${(props) => (props.checked ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

// 라벨
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSize.body.min};
  color: ${(props) => props.theme.colors.text_D};
`;

// 부모에서 데이터 전달 받기
interface RoleSelectProps {
  onRoleChange: (desireLecturer: boolean | null) => void;
  selectedRole: boolean | null;
  styleType?: "card" | "checkbox";
}

const RoleSelect = ({
  onRoleChange,
  selectedRole,
  styleType = "card", // 기본값 카드임
}: RoleSelectProps) => {
  //학생일 때만 체크박스 보여주려고 리덕스에서 데이터 가져오기
  const isDesireLecturer = useSelector(
    (state: RootState) => state.auth.desireLecturer
  );

  // role card 선택 핸들러
  const handleRoleSelect = (roleType: string) => {
    if (roleType === "student") {
      onRoleChange(false);
      console.log("학생 선택됨: false");
    } else if (roleType === "teacher") {
      onRoleChange(true);
      console.log("강사 선택됨:true ");
    }
  };

  //role checkbox 핸들러
  const handleCheckbox = () => {
    if (selectedRole == true) {
      onRoleChange(false); // 체크가 되어있으면 학생으로 role change
    } else {
      onRoleChange(true);
    }
  };

  // role 선택 시 각각 메세지 보여줌
  const getDescriptionText = () => {
    if (styleType === "checkbox") {
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
      {isDesireLecturer ? null : (
        <>
          {styleType === "checkbox" && (
            <CheckboxContainer>
              <CheckboxLabel>
                <HiddenCheckbox
                  id="lecturerDesire"
                  checked={selectedRole === true}
                  onChange={handleCheckbox}
                />
                <CustomCheckbox checked={selectedRole === true} />
                강사로 전환하기
              </CheckboxLabel>
            </CheckboxContainer>
          )}
        </>
      )}
      {styleType === "card" && (
        <RoleCardContainer>
          <RoleTitle>사용하시는 분이 누구인가요 ?</RoleTitle>
          <RoleOptionContainer>
            <RoleOption
              selected={selectedRole === false}
              onClick={() => handleRoleSelect("student")}
            >
              <RoleIcon selected={selectedRole === false}>
                <img src={studentImage} alt="학생" />
              </RoleIcon>
              <RoleLabel selected={selectedRole === false}>학생</RoleLabel>
            </RoleOption>

            <RoleOption
              selected={selectedRole === true}
              onClick={() => handleRoleSelect("teacher")}
            >
              <RoleIcon selected={selectedRole === true}>
                <img src={teacherImage} alt="선생님" />
              </RoleIcon>
              <RoleLabel selected={selectedRole === true}>선생님</RoleLabel>
            </RoleOption>
          </RoleOptionContainer>
          <RoleCheckMessage>{getDescriptionText()}</RoleCheckMessage>
        </RoleCardContainer>
      )}
    </RollSection>
  );
};

export default RoleSelect;
