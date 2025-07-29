import styled from 'styled-components';

const ItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  margin-bottom: 3px;
  height: 59px;
  border: 2px solid #e8e7e7;
  background: #fefefe;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  border-radius: 6px;
  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: #a5a9ab;
  }
`;

const LeftBox = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  padding: 5px 10px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #222;
`;

const Lecture = styled.div`
  font-size: 12px;
  color: #666;
`;

const Duration = styled.div`
  font-size: 12px;
  padding-right: 10px;
  text-align: right;
  color: #999;
`;

type LessonInfo = {
  title: string;
  lecture: string;
  duration: string;
};

interface LessonItemProps {
  data: LessonInfo;
}

const LessonItem = ({ data }: LessonItemProps) => {
  return (
    <ItemWrapper onClick={() => console.log("클릭")}>
      <LeftBox>
        <Title>{data.title}</Title>
        <Lecture>{data.lecture}</Lecture>
      </LeftBox>
      <Duration>{data.duration}</Duration>
    </ItemWrapper>
  );
};

export default LessonItem;
