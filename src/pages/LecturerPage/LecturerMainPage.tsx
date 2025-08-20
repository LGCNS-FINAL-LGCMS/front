import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../components/Common/Button";
import LecturerLectureContainer from "../../components/LecturerLecture/LecturerLectureContainer";
import { PAGE_PATHS } from "../../constants/pagePaths";

const PageWrapper = styled.div`
  position: relative;
  padding-top: calc(${({ theme }) => theme.size.header.height} / 2 + 5px);
  min-height: 100vh;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: -10px;
  right: 105px;
`;

const LecturerMainPage = () => {
  const navigate = useNavigate();

  const handleAddLecture = () => {
    navigate(PAGE_PATHS.CREATE_LECTURE);
  };

  return (
    <PageWrapper>
      <ButtonContainer>
        <Button
          text="+ 강의 추가"
          onClick={handleAddLecture}
          design={2}
          fontWeight={700}
        />
      </ButtonContainer>
      <LecturerLectureContainer />
    </PageWrapper>
  );
};

export default LecturerMainPage;
