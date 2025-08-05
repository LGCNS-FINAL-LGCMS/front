import { useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import MDEditor from "@uiw/react-md-editor";

const MemoWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 0.25fr 2fr 1.5fr 0.25fr;
  gap: 10px;
  padding: 10px;
`;

const MemoNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MarkdownPreview = styled.div`
  padding: 10px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 14px;
  line-height: 1.6;
`;

const StyledEditorWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 6px;

  .w-md-editor {
    height: 286px !important;
    background-color: white;
  }

  .w-md-editor-content {
    flex: 1;
    display: flex !important;
    flex-direction: column !important;
  }

  .w-md-editor-text {
    flex: 1 !important;
    overflow-y: auto !important;
    padding: 10px;
  }

  .w-md-editor-preview {
    display: none !important;
  }
`;

const SaveButton = styled.button`
  /* justify-self: end; */
  align-self: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #adabab;
  }
`;

const Memo = () => {
  const [markdown, setMarkdown] = useState("메모를 마크다운으로 입력해 보세요!");

  const handleSave = () => {
    console.log("✅ 저장된 내용:", markdown);
  };

  return (
    <MemoWrapper>
      <MemoNav>
        <SaveButton>{`<`}</SaveButton>
        {/* <div> 1 </div> 메모 id 넣기? */}
        <SaveButton>{`>`}</SaveButton>
      </MemoNav>

      <MarkdownPreview>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter language={match[1]} style={nord} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>{children}</code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </MarkdownPreview>

      <StyledEditorWrapper data-color-mode="light">
        <MDEditor
          value={markdown}
          onChange={(value) => setMarkdown(value ?? "")}
          preview="edit"
        />
      </StyledEditorWrapper>

      <SaveButton onClick={handleSave}> 메모 저장</SaveButton>
    </MemoWrapper>
  );
};

export default Memo;
