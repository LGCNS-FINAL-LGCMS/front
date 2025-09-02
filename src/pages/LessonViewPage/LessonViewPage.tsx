import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";
import styled from "styled-components";
import Button from "../../components/Common/Button";
import { getLessonDetails } from "../../api/Lesson/lessonAPI";
import type { Lesson } from "../../types/lesson";

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 100vh;
  padding-top: ${({ theme }) => theme.size.header.height};
  background: ${({ theme }) => theme.colors.background_B};
  font-family: ${({ theme }) => theme.font.primary};
`;

const VideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - ${({ theme }) => theme.size.header.height});
  padding: 2rem;
`;

const Video = styled.video`
  width: 100%;
  height: 90%;
  object-fit: cover;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background_D};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  transition: ${({ theme }) => theme.transition.default};
`;

const ControlBar = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${({ theme }) => theme.size.header.height});
  background: ${({ theme }) => theme.colors.background_D};
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabMenu = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background_D};
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 16px;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSize.body.max};
  border: none;
  cursor: pointer;
  background: ${({ active }) =>
    active ? "rgba(0, 93, 159, 0.30)" : "transparent"};
  color: ${({ theme, active }) =>
    active ? theme.colors.text_B : theme.colors.gray_L};
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    background: rgba(0, 93, 159, 0.2);
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 93, 159, 0.4);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background_D};
  }
`;

const LessonItem = styled.div<{ selected?: boolean }>`
  position: relative;
  padding: 16px 20px 16px 50px;
  margin-bottom: 12px;
  border-radius: 12px;
  background-color: ${({ selected, theme }) =>
    selected ? "rgba(0, 93, 159, 0.4)" : theme.colors.background_D};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ selected }) =>
    selected
      ? "0 3px 10px rgba(255, 255, 255, 0.12)"
      : "0 2px 6px rgba(0, 0, 0, 0)"};

  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &::before {
    content: attr(data-index);
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 700;
    font-size: ${({ theme }) => theme.fontSize.body.max};
    color: ${({ selected, theme }) =>
      selected ? theme.colors.text_B : theme.colors.gray_M};
  }

  strong {
    font-size: ${({ theme }) => theme.fontSize.body.max};
    color: ${({ theme }) => theme.colors.text_B};
  }

  p {
    margin: 4px 0 0;
    font-size: ${({ theme }) => theme.fontSize.small.max};
    color: ${({ theme }) => theme.colors.gray_L};
  }
`;

type SidebarTab = "lecture" | "chatbot";

const LessonViewPage: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const hls = new Hls();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<typeof hls.levels>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<SidebarTab>("lecture");
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [lessonList, setLessonList] = useState<Lesson[] | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (lessonList && lessonList.length > 0) {
      setSelectedLesson(0);
      setCurrentLesson(lessonList[0]);
    }
  }, [lessonList]);

  useEffect(() => {
    if (!currentLesson || !videoRef.current) return;

    hlsRef.current?.destroy();

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentLesson.videoUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setLevels(data.levels.filter((lvl: any) => lvl.height >= 360));
      });
      hlsRef.current = hls;
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = currentLesson.videoUrl;
    }
  }, [currentLesson]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lectureId) return;
      try {
        const res = await getLessonDetails(lectureId);
        setLessonList(res);
      } catch (err) {
        console.error("레슨 불러오기 실패:", err);
      }
    };

    fetchLesson();
  }, [lectureId]);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        if (currentLesson == null) return;
        const hls = new Hls();
        hls.loadSource(currentLesson?.videoUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setLevels(data.levels.filter((lvl: any) => lvl.height >= 360));
        });
        hlsRef.current = hls;
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        if (currentLesson == null) return;
        videoRef.current.src = currentLesson?.videoUrl;
      }
    }
    return () => hlsRef.current?.destroy();
  }, []);

  const handleLevelChange = (level: number) => {
    if (hlsRef.current) {
      if (hlsRef.current.currentLevel === level) return;
      hlsRef.current.currentLevel = level;
      setCurrentLevel(level);
    }
  };

  const formatPlaytime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (minutes === 0) return `${secs}초`;
    if (secs === 0) return `${minutes}분`;
    return `${minutes}분 ${secs}초`;
  };

  return (
    <Container>
      <VideoWrapper>
        <Video ref={videoRef} controls poster={currentLesson?.thumbnail} />
        <ControlBar>
          {levels.map((level, idx) => (
            <Button
              key={idx}
              text={`${level.height}p`}
              onClick={() => handleLevelChange(idx)}
              fontWeight={currentLevel === idx ? 700 : 400}
              fontColor={1}
              design={1}
            />
          ))}
        </ControlBar>
      </VideoWrapper>

      <Sidebar>
        <TabMenu>
          <TabButton
            active={activeTab === "lecture"}
            onClick={() => setActiveTab("lecture")}
          >
            강좌
          </TabButton>
          <TabButton
            active={activeTab === "chatbot"}
            onClick={() => setActiveTab("chatbot")}
          >
            튜터 챗봇
          </TabButton>
        </TabMenu>
        <TabContent>
          {activeTab === "lecture" &&
            lessonList?.map((lesson, idx) => (
              <LessonItem
                key={idx}
                data-index={`${idx + 1}`}
                selected={selectedLesson === idx}
                onClick={() => {
                  setSelectedLesson(idx);
                  setCurrentLesson(lesson);
                }}
              >
                <strong>{lesson.title}</strong>
                <p>{formatPlaytime(lesson.playtime)}</p>
              </LessonItem>
            ))}
          {activeTab === "chatbot" && <div>튜터 챗봇 내용 표시</div>}
        </TabContent>
      </Sidebar>
    </Container>
  );
};

export default LessonViewPage;
