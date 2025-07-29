import styled from 'styled-components';

const LectureMetaWrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100%;
  background-color: transparent;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px 12px;
  gap: 12px;
`;

const LectureTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #0f0f0f;
`;

const UpBox = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 10px;
  gap: 8px;
`;

const LessonTitle = styled.div`
  font-size: 14px;
  color: #606060;
`;

const TName = styled.div`
  font-size: 15px;
  color: #909090;
  white-space: nowrap;
`;

const LectureDesc = styled.div`
  font-size: 14px;
  color: #0f0f0f;
  line-height: 1.6;
  overflow-y: auto;
  padding-right: 4px;
  max-height: 210px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

type LectureMetaProps = {
  lecture: string; // 강의이름
  lesson: string;  // 강좌이름
  name: string;    // 강사이름
  desc: string;    // 강좌설명
  time: string;    // 강좌시간
};

const LectureMeta = ({ lecture, lesson, name, desc, time }: LectureMetaProps) => {
  return (
    <LectureMetaWrapper>
        <LectureTitle>{lecture}</LectureTitle>
     <UpBox>
        <LessonTitle>{lesson} · {time}</LessonTitle>
        <TName>강사: {name}</TName>
     </UpBox> 
    <LectureDesc>{desc}</LectureDesc>
    </LectureMetaWrapper>
  );
};

export default LectureMeta;
