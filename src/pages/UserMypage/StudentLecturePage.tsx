import styled from "styled-components";

import StudentLectureContainer from "../../components/StudentLecture/StudentLectureContainer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height});
  font-family: ${(props) => props.theme.font.primary};
`;

const MypageTitle = styled.h1`
  width: ${(props) => props.theme.size.bottomLine};
  font-size: ${({ theme }) => theme.fontSize.title.max};
  color: ${({ theme }) => theme.colors.text_D};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border_Dark};
  padding: 10px 0;
`;

const StudentLecturePage = () => {
  return (
    <Container>
      <MypageTitle>나의 강의실</MypageTitle>
      <StudentLectureContainer />
    </Container>
  );
};

export default StudentLecturePage;
