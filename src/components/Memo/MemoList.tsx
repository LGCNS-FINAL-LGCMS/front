// src/components/Lecture/MemoList.tsx
import styled from "styled-components";
import type { MemoInfo } from "../../api/memoApi";

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
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:hover {
    background: #f0f0f0;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 13px;
`;

const Preview = styled.div`
  font-size: 11px;
  color: #666;
  white-space: nowrap;        /* 한 줄만 표시 */
  overflow: hidden;           /* 넘치는 글자는 숨김 */
  text-overflow: ellipsis;    /* ... 처리 */
`;

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
          <Title>{memo.title}</Title>
          <Preview>
            {memo.content?.replace(/\n/g, " ") || "내용 없음"}
          </Preview>
        </MemoItem>
      ))}
    </ListWrapper>
  );
};

export default MemoList;
