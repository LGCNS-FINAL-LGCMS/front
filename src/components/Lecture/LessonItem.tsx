import styled from 'styled-components';

const ItemWrapper = styled.div<{ isSelected: boolean }>`
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-template-areas: "text time";
  gap: 5px;
  height: 60px;
  border: 1px solid #ddd;
  background: ${({ isSelected }) => (isSelected ? "#d3d3d3" : "#fff")};
  border-radius: 6px;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? "#c0c0c0" : "#f0f0f0")};
  }
`;

const TextArea = styled.div`
  grid-area: text;
  display: grid;
  grid-template-rows: 1fr 1fr;
  padding-left: 15px;
  gap: 5px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #222;
  padding-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Info = styled.div`
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Duration = styled.div`
  grid-area: time;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface LessonInfo {
  title: string;
  lecture: string;
  duration: string;
}

interface LessonItemProps {
  data: LessonInfo;
  onClick: () => void;
  isSelected: boolean;
}

const LessonItem = ({ data, onClick, isSelected }: LessonItemProps) => {
  return (
    <ItemWrapper onClick={onClick} isSelected={isSelected}>
      <TextArea>
        <Title>{data.title}</Title>
        <Info>{data.lecture}</Info>
      </TextArea>
      <Duration>{data.duration}</Duration>
    </ItemWrapper>
  );
};

export default LessonItem;
