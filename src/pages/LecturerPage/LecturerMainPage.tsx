import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../components/Common/Button";
import LecturerLectureContainer from "../../components/LecturerLecture/LecturerLectureContainer";
import { PAGE_PATHS } from "../../constants/pagePaths";

const PageWrapper = styled.div`
  position: relative;
  padding-top: calc(${({ theme }) => theme.size.header.height} / 2);
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height} - 40px);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${({ theme }) => theme.size.bottomLine};
  margin: 0 auto 16px;
  padding: 0 20px;
`;
const ButtonOffset = styled.div`
  margin-top: -16px;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
`;

const Underline = styled.div`
  width: ${({ theme }) => theme.size.bottomLine};
  height: 2px;
  background-color: ${({ theme }) => theme.colors.header};
  margin: 0 auto 24px;
  border-radius: 1px;
`;

const LecturerMainPage = () => {
  const navigate = useNavigate();

  const handleAddLecture = () => {
    navigate(PAGE_PATHS.CREATE_LECTURE);
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>강의 컨텐츠</PageTitle>
        <ButtonOffset>
          <Button
            text="+ 강의 추가"
            onClick={handleAddLecture}
            design={1}
            fontWeight={700}
          />
        </ButtonOffset>
      </PageHeader>
      <Underline />
      <LecturerLectureContainer />
    </PageWrapper>
  );
};

export default LecturerMainPage;
