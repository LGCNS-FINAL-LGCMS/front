import { useMemoStore } from "../../hooks/useMemoStore";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import MemoList from "./MemoList";

interface MemoProps {
  lessonId: string;
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
  height: 100%;
`;

const MemoListArea = styled.div`
  grid-area: list;
  height: 100%;
  overflow-y: hidden;
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

const Memo = ({ lessonId }: MemoProps) => {
  const {
    memos,
    selectedId,
    addMemo,
    updateMemo,
    deleteMemo,
    selectMemo,
    getSelectedMemo,
  } = useMemoStore(lessonId);

  const selectedMemo = getSelectedMemo();
  const markdown = selectedMemo?.content ?? "";

  return (
    <MemoWrapper>
      <EditorArea>
        <div data-color-mode="light">
          <MDEditor
            value={markdown}
            onChange={(value = "") => updateMemo(value)}
            preview="live"
            textareaProps={{
              placeholder: "마크다운으로 메모를 작성해 보세요...", // 플레이스홀더 역할
             }}
          />
        </div>
      </EditorArea>

      <ButtonArea>
        <IconButton onClick={addMemo} title="메모 추가">➕</IconButton>
        <IconButton onClick={() => updateMemo(markdown)} title="저장">💾</IconButton>
        <IconButton onClick={deleteMemo} title="삭제">❌</IconButton>
      </ButtonArea>

      <MemoListArea>
        <MemoList memos={memos} selectedId={selectedId} onSelect={selectMemo} />
      </MemoListArea>
    </MemoWrapper>
  );
};

export default Memo;