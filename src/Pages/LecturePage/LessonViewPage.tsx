// src/pages/LessonViewPage.tsx
import styled from "styled-components";

import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import LessonPlayer from "../../components/Lecture/LessonPlayer";
import LessonList from "../../components/Lecture/LessonList";


const LessonViewWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "title"
    "content";
  height: calc(100vh - ${({ theme }) => theme.size.header.height});
  padding: 10px;
  gap: 10px;
  overflow: hidden;
`;

const TitleArea = styled.div`
  grid-area: title;
  display: flex;
  align-items: center;
  padding: 0 10px;
  min-height: 50px;
  color: black;
  font-weight: bold;
  gap: 20px;
`;

const LessonViewArea = styled.div`
  grid-area: content;
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-areas: "lessonlistArea main";
  gap: 10px;
  height: 100%;
  overflow: hidden; // 내부 영역이 넘어가는 걸 방지
`;

const ListArea = styled.div`
  grid-area: lessonlistArea;
  height: 100%;
  overflow: hidden;
`;

const LessonMain = styled.div`
  grid-area: main;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "top"
    "memo";
  gap: 10px;
  height: 100%;
`;

const TopContent = styled.div`
  grid-area: top;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas: "player chat";
  gap: 10px;
`;

const PlayerArea = styled.div`
  grid-area: player;
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const ChatBotArea = styled.div`
  grid-area: chat;
  background-color: red;
  height: 100%;
`;

const MemoArea = styled.div`
  grid-area: memo;
  background-color: green;
  height: 100%;
`;

// 공통 버튼으로 변경하자
const BackButton = styled.button`
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
`;

// LessonList
type LessonInfo = {
  id: string;
  title: string;
  lecture: string;
  duration: string;
  videoUrl: string;
};

const dummyLessons: LessonInfo[] = [
  {
    id: "1",
    title: "컴포넌트 이해하기",
    lecture: "컴포넌트 이해하기 이렇게 하면 됩니다. 어쩌구 저쩌구ㅇㄹㅊㄴㅇㅊㄴㅇㅊㄴㅇ",
    duration: "25분",
    videoUrl: "https://www.youtube.com/embed/Tm74nPLv10I",
  },
  {
    id: "2",
    title: "React Hooks 마스터하기",
    lecture: "useState, useEffect 등 활용 팁",
    duration: "40분",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "3",
    title: "TypeScript 기본 문법",
    lecture: "변수, 함수, 인터페이스 등 핵심 문법",
    duration: "30분",
    videoUrl: "https://www.youtube.com/embed/t1e8gOZ4X8c",
  },
];

const LessonViewPage = () => {

  const [lessons, setLessons] = useState<LessonInfo[]>([]);

  //강좌 선택하기
  const [selectedLesson, setSelectedLesson] = useState<LessonInfo | null>(null);

  useEffect(() => {
      setLessons(dummyLessons);
    }, []);

    const handleSelectLesson = (id: string) => {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) setSelectedLesson(lesson);
    };
  
  // 내강의실로 돌아가기
      const navigateToMypage = useNavigate();
      const handleBack = () => {navigateToMypage("/");};

  return (
    <LessonViewWrapper>
      <TitleArea>
        <BackButton onClick={handleBack}> ← </BackButton> 
        {selectedLesson ? selectedLesson.title : "강의를 선택하세요"}
      </TitleArea>

      <LessonViewArea>
        <ListArea>
          <LessonList
            lessons={lessons}
            selectedId={selectedLesson?.id || null}
            onSelect={handleSelectLesson}
             />
        </ListArea>

        <LessonMain>
          <TopContent>
            <PlayerArea>
             {selectedLesson && <LessonPlayer src={selectedLesson.videoUrl} />}
            </PlayerArea>

            <ChatBotArea>
              챗봇 (ChatBotArea)
            </ChatBotArea>
          </TopContent>

          <MemoArea>
            메모 (MemoArea)
          </MemoArea>
        </LessonMain>
      </LessonViewArea>
    </LessonViewWrapper>
  );
};

export default LessonViewPage;
