import styled from "styled-components";

const RollSection = styled.div``;

const RoleTitle = styled.h2``;

const RoleOptionContainer = styled.div``;

const RoleOption = styled.div<{ selected?: boolean }>``;

const RoleIcon = styled.div``;

const RoleLabel = styled.div``;

interface RoleSelectProps {
  onRoleChange: (wantTeacher: boolean | null) => void;
  selectedRole: boolean | null;
}

const RoleSelect = ({ onRoleChange, selectedRole }: RoleSelectProps) => {
  const handleRoleSelect = (roleType: string) => {
    if (roleType === "student") {
      onRoleChange(false);
      console.log("학생 선택됨: false");
    } else if (roleType === "teacher") {
      onRoleChange(true);
      console.log("강사 선택됨:true ");
    }
  };

  return (
    <RollSection>
      <RoleTitle>사용하시는 분이 누구인가요 ?</RoleTitle>
      <RoleOptionContainer>
        <RoleOption
          selected={selectedRole == false}
          onClick={() => handleRoleSelect("student")}
        >
          <RoleIcon>🔥</RoleIcon>
          <RoleLabel>학생</RoleLabel>
        </RoleOption>

        <RoleOption
          selected={selectedRole == true}
          onClick={() => handleRoleSelect("teacher")}
        >
          <RoleIcon>📖</RoleIcon>
          <RoleLabel>선생님</RoleLabel>
        </RoleOption>
      </RoleOptionContainer>
    </RollSection>
  );
};

export default RoleSelect;
