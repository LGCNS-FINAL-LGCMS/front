import styled from "styled-components";

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 5px;
  height: 100%;
  overflow-y: auto;
`;

const MemoHeader = styled.div`
  padding: 5px;
  font-weight: bold;
  background-color: #f3f3f3;
  border-bottom: 1px solid #ddd;
`;

const MemoItem = styled.div<{ selected: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${({ selected }) => (selected ? "#e9f7ff" : "#fff")};
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #f0f0f0;
  }
`;

interface MemoInfo {
  id: string;
  title: string;
  content: string;
}

interface MemoListProps {
  memos: MemoInfo[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const MemoList = ({ memos, selectedId, onSelect }: MemoListProps) => {
  return (
    <ListWrapper>
      <MemoHeader>📋 메모 리스트</MemoHeader>
      {memos.map((memo) => (
        <MemoItem
          key={memo.id}
          selected={memo.id === selectedId}
          onClick={() => onSelect(memo.id)}
        >
          {memo.title}
        </MemoItem>
      ))}
    </ListWrapper>
  );
};

export default MemoList;
