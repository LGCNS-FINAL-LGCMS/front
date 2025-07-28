import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../Common/Button"; // 경로는 실제 위치에 맞게 조정

const KeywordsWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

interface KeywordButtonsProps {
  onKeywordClick: (keyword: string) => void;
}

const KeywordButtons: React.FC<KeywordButtonsProps> = ({ onKeywordClick }) => {
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    async function fetchKeywords() {
      try {
        // TODO: 실제 API 주소로 변경
        const res = await fetch("/api/popular-keywords?limit=5");
        if (!res.ok) throw new Error("Failed to fetch keywords");
        const data: string[] = await res.json();
        setKeywords(data.slice(0, 5));
      } catch (error) {
        console.error("키워드 불러오기 실패:", error);
        // fallback 키워드
        setKeywords(["리액트", "스프링", "자바", "C#", "안녕"]);
      }
    }
    fetchKeywords();
  }, []);

  return (
    <KeywordsWrapper>
      {keywords.map((keyword) => (
        <Button
          key={keyword}
          text={keyword}
          onClick={() => onKeywordClick(keyword)}
          design={2}
          fontColor={2}
          fontWeight={700}
        />
      ))}
    </KeywordsWrapper>
  );
};

export default KeywordButtons;
