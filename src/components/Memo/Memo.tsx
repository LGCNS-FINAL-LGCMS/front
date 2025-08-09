// src/components/Lecture/Memo.tsx
// 핵심: draft는 로컬 상태, 저장 버튼을 눌러야만 onUpdate(id, draft) 호출
import { useEffect, useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import MemoList from "./MemoList";
import type { MemoInfo } from "../../api/memoApi";

interface MemoProps {
  lessonId: string;
  memos: MemoInfo[];                         // 부모 상태
  selectedId: string;                        // 부모 상태
  onAdd: () => void;                         // 부모가 POST 호출
  onUpdate: (id: string, content: string) => void; // 부모가 PUT/PATCH 호출
  onDelete: (id: string) => void;            // 부모가 DELETE 호출
  onSelect: (id: string) => void;            // 부모 선택 상태 변경
}

const MemoWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 3.5fr 0.2fr 0.8fr;
  grid-template-areas: "editor save list";
  gap: 5px;
`;

const EditorArea = styled.div`
  grid-area: editor;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 내부 스크롤 보장 */
`;

const MemoListArea = styled.div`
  grid-area: list;
  height: 100%;
  overflow-y: auto;
`;

const ButtonArea = styled.div`
  grid-area: save;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const IconButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
  }
`;

const Memo = ({
  lessonId,
  memos,
  selectedId,
  onAdd,
  onUpdate,
  onDelete,
  onSelect,
}: MemoProps) => {
  // ✅ 선택된 메모 찾기
  const selectedMemo = useMemo(
    () => memos.find((m) => m.id === selectedId),
    [memos, selectedId]
  );

  // ✅ 로컬 초안(draft): 저장 버튼을 눌러야 서버 반영
  const [draft, setDraft] = useState<string>(selectedMemo?.content ?? "");

  // ✅ 선택 변경 시 draft 동기화
  useEffect(() => {
    setDraft(selectedMemo?.content ?? "");
  }, [selectedMemo?.id]);

  return (
    <MemoWrapper data-lesson-id={lessonId}>
      <EditorArea>
        <div data-color-mode="light">
          <MDEditor
            value={draft}
            onChange={(value = "") => setDraft(value)} // 초안만 갱신
            preview="live"
            textareaProps={{
              placeholder: "마크다운으로 메모를 작성해 보세요...", // 플레이스홀더
            }}
          />
        </div>
      </EditorArea>

      <ButtonArea>
        {/* ➕ 생성: 빈 메모 생성은 부모에서 처리(POST) */}
        <IconButton onClick={onAdd} title="메모 추가">➕</IconButton>

        {/* 💾 저장: 현재 선택된 메모에 draft 반영(부모가 PUT/PATCH) */}
        <IconButton
          onClick={() => selectedMemo?.id && onUpdate(selectedMemo.id, draft)}
          title="저장"
          disabled={!selectedMemo?.id}
        >
          💾
        </IconButton>

        {/* ❌ 삭제: 선택된 메모 삭제(부모가 DELETE) */}
        <IconButton
          onClick={() => selectedMemo?.id && onDelete(selectedMemo.id)}
          title="삭제"
          disabled={!selectedMemo?.id}
        >
          ❌
        </IconButton>
      </ButtonArea>

      <MemoListArea>
        <MemoList memos={memos} selectedId={selectedId} onSelect={onSelect} />
      </MemoListArea>
    </MemoWrapper>
  );
};

export default Memo;
