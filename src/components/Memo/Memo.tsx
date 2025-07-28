// components/Memo.tsx

import { useState } from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";

const MemoWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 40px 1fr auto 40px; // 네 영역 분할
  gap: 10px;
  padding: 10px;
`;

const MemoNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MarkdownEditorWrapper = styled.div`
  height: 100%;
  min-height: 0;

  .w-md-editor {
    height: 100% !important;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    overflow: hidden;
    font-size: 12px;
  }

  .w-md-editor-toolbar {
    flex-shrink: 0;
  }

  .w-md-editor-content {
    flex: 1;
    display: flex !important;
    flex-direction: row !important; // preview vertical 모드 대응
    min-height: 0;
  }

  .w-md-editor-text,
  .w-md-editor-preview {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .w-md-editor-text-input {
    resize: none !important;
    height: 100% !important;
    font-size: 12px;
    padding: 12px;
  }
`;

const SaveButton = styled.button`
  justify-self: end;
  align-self: center;
  padding: 8px 16px;
  background-color: #56abb0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #428386;
  }
`;

const Memo = () => {
  const [markdown, setMarkdown] = useState(`# 📘 마크다운 예시\n\n- 항목1\n- 항목2`);

  const handleSave = () => {
    console.log("✅ 저장된 내용:", markdown);
  };

  return (
    <MemoWrapper>
      <MemoNav>
        <button>{`< 이전 메모`}</button>
        <button>{`다음 메모 >`}</button>
      </MemoNav>

      <MarkdownEditorWrapper data-color-mode="light">
        <MDEditor
          value={markdown}
          onChange={(value) => setMarkdown(value || "")}
          preview="live"
          previewOptions={{ layout: "vertical" }}
          height="100%"
        />
      </MarkdownEditorWrapper>

      <div /> {/* 필요 시 기타 UI 배치용 */}

      <SaveButton onClick={handleSave}>저장</SaveButton>
    </MemoWrapper>
  );
};

export default Memo;
