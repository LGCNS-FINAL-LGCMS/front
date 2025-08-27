import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import styled from "styled-components";
import Button from "../../components/Common/Button";

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
  padding: 14px 16px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: ${({ selected }) =>
    selected ? "rgba(0, 93, 159, 0.4)" : "transparent"};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: rgba(0, 93, 159, 0.3);
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
  const hls = new Hls();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<typeof hls.levels>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<SidebarTab>("lecture");
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const lessons = Array.from({ length: 10 }).map((_, i) => ({
    title: `레슨 ${i + 1}: 모던 스타일 강좌`,
    duration: "23분",
  }));

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setLevels(data.levels.filter((lvl: any) => lvl.height >= 360));
        });
        hlsRef.current = hls;
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src =
          "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
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

  return (
    <Container>
      <VideoWrapper>
        <Video
          ref={videoRef}
          controls
          poster="https://via.placeholder.com/1280x720.png?text=Lesson+Thumbnail"
        />
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
            lessons.map((lesson, idx) => (
              <LessonItem
                key={idx}
                selected={selectedLesson === idx}
                onClick={() => setSelectedLesson(idx)}
              >
                <strong>{lesson.title}</strong>
                <p>{lesson.duration}</p>
              </LessonItem>
            ))}
          {activeTab === "chatbot" && <div>튜터 챗봇 내용 표시</div>}
        </TabContent>
      </Sidebar>
    </Container>
  );
};

export default LessonViewPage;
