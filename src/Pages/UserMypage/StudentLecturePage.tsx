import styled from "styled-components";

import StudnetLectureContainer from "../../components/StudentLecture/StudentLectureContainer";

const StudentLectureSection = styled.div``;

const MypageTitle = styled.p`
  border-bottom: 2px solid;
  width: 1080px;
  font-size: ${(props) => props.theme.fontSize.title.max};
  font-family: ${(props) => props.theme.font.primary};
  border-color: ${(props) => props.theme.colors.border_Dark};
  margin: 0 auto 30px auto; /* 👈 좌우 auto로 가운데 정렬! */
`;

const StudentLecturePage = () => {
  return (
    <StudentLectureSection>
      <MypageTitle>MY PAGE</MypageTitle>
      <StudnetLectureContainer />
    </StudentLectureSection>
  );
};

export default StudentLecturePage;
