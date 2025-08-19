import styled from "styled-components";
import studentImage from "../../assets/images/selectedStudent.png";
import teacherImage from "../../assets/images/selectedTeacher.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

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
  const isDesireLecturer = useSelector(
    (state: RootState) => state.auth.desireLecturer
  );

  const handleRoleSelect = (roleType: string) => {
    if (roleType === "student") {
      onRoleChange(false);
      console.log("학생 선택됨: false");
    } else if (roleType === "teacher") {
      onRoleChange(true);
      console.log("강사 선택됨:true ");
    }
  };

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
          {
            <RoleCardType>
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
            </RoleCardType>
          }
        </>
      )}
    </RollSection>
  );
};

export default RoleSelect;
