import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";
import type { Level } from "hls.js";
import type { ManifestParsedData } from "hls.js";
import styled from "styled-components";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Common/Button";
import { useNavigate } from "react-router-dom";
import {
  getLessonDetails,
  patchLessonProgress,
} from "../../api/Lesson/lessonAPI";
import type { Lesson } from "../../types/lesson";
import { tutorRequest } from "../../api/Tutor/tutorAPI";
import MessageList from "../../components/Common/Chat/MessageList";
import type { ChatMessage } from "../../types/message";
import MessageInput from "../../components/Common/Chat/MessageInput";
import { PAGE_PATHS } from "../../constants/pagePaths";

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

const ScrollableSidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray_D};
    border-radius: 10px;
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

const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.background_Overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalContent = styled.div<{ isSuccess: boolean }>`
  background: #fff;
  width: ${({ theme }) => theme.size.modal.width};
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  text-align: center;
  animation: fadeIn 0.3s ${({ theme }) => theme.transition.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h2 {
    font-size: ${({ theme }) => theme.fontSize.title.max};
    color: ${({ isSuccess, theme }) =>
      isSuccess ? theme.colors.success : theme.colors.danger};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    font-size: ${({ theme }) => theme.fontSize.body.max};
    color: ${({ theme }) => theme.colors.text_D};
    margin: 0;
  }
`;

const Modal: React.FC<{
  message: string;
  onClose: () => void;
  navigate: () => void;
}> = ({ message, onClose, navigate }) => {
  const handleCloseAndNavigate = () => {
    onClose();
    navigate();
  };

  return (
    <ModalBackdrop onClick={handleCloseAndNavigate}>
      <ModalContent onClick={(e) => e.stopPropagation()} isSuccess={false}>
        <h2>
          <FontAwesomeIcon icon={faCircleXmark} size="2x" />
          "실패"
        </h2>
        <p>{message}</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button text="확인" onClick={handleCloseAndNavigate} design={1} />
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
};

type SidebarTab = "lecture" | "chatbot";

const LessonViewPage: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<SidebarTab>("lecture");
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [lessonList, setLessonList] = useState<Lesson[] | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (lessonList && lessonList.length > 0) {
      setSelectedLesson(0);
      setCurrentLesson(lessonList[0]);
    }
  }, [lessonList]);

  useEffect(() => {
    const setupVideo = () => {
      if (!currentLesson || !videoRef.current) return;

      hlsRef.current?.destroy();

      const hls = new Hls();

      if (Hls.isSupported()) {
        hls.loadSource(currentLesson.videoUrl);
        hls.attachMedia(videoRef.current);
        hls.on(
          Hls.Events.MANIFEST_PARSED,
          (_event, data: { levels: Level[] }) => {
            setLevels(data.levels.filter((lvl) => lvl.height >= 360));
          }
        );
        hlsRef.current = hls;
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = currentLesson.videoUrl;
      }

      if (videoRef.current && currentLesson.progress != null) {
        videoRef.current.currentTime =
          (currentLesson.playtime * currentLesson.progress) / 100;
      }
    };

    setupVideo();

    return () => {
      hlsRef.current?.destroy();
    };
  }, [currentLesson]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lectureId) return;
      try {
        const res = await getLessonDetails(lectureId);
        setLessonList(res);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.";

        setModalMessage(errorMessage);
        setModalOpen(true);
      }
    };

    fetchLesson();
  }, [lectureId]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        if (currentLesson == null) return;
        const hls = new Hls();
        hls.loadSource(currentLesson?.videoUrl);
        hls.attachMedia(videoRef.current);
        hls.on(
          Hls.Events.MANIFEST_PARSED,
          (_event, data: ManifestParsedData) => {
            setLevels(data.levels.filter((lvl) => lvl.height >= 360));
          }
        );

        hlsRef.current = hls;
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        if (currentLesson == null) return;
        videoRef.current.src = currentLesson?.videoUrl;
      }
    }
    return () => hlsRef.current?.destroy();
  }, [currentLesson]);

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

  const saveProgress = async () => {
    if (!currentLesson || !lectureId || !videoRef.current) return;

    const playtime = Math.floor(videoRef.current.currentTime);
    const lessonId = currentLesson.id;

    try {
      await patchLessonProgress(
        lectureId,
        lessonId,
        playtime,
        currentLesson.playtime
      );
    } catch (error) {
      console.error("진도 저장 실패:", error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      if (!video.paused && !video.ended) {
        saveProgress();
      }
    };

    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [currentLesson]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let interval: NodeJS.Timeout | null = null;

    const startProgressInterval = () => {
      if (interval === null) {
        interval = setInterval(() => {
          if (!video.paused && !video.ended) {
            saveProgress();
          }
        }, 5000);
      }
    };

    const stopProgressInterval = () => {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
    };

    video.addEventListener("play", startProgressInterval);
    video.addEventListener("pause", stopProgressInterval);
    video.addEventListener("ended", stopProgressInterval);

    return () => {
      video.removeEventListener("play", startProgressInterval);
      video.removeEventListener("pause", stopProgressInterval);
      video.removeEventListener("ended", stopProgressInterval);
      stopProgressInterval();
    };
  }, [currentLesson]);

  useEffect(() => {
    const handleUnload = () => {
      saveProgress();
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        saveProgress();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleUnload);
    };
  }, [currentLesson]);

  const handleSend = async (message: string) => {
    if (!message.trim() || !lectureId) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      type: "text",
      content: message.trim(),
      timestamp: 0,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await tutorRequest(lectureId, userMsg.content);
      const botMsg: ChatMessage = {
        id: Date.now().toString() + "_bot",
        sender: "bot",
        type: "text",
        content: res.answer ?? "응답이 없습니다.",
        timestamp: 0,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }
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
        <ScrollableSidebarContent>
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
          {activeTab === "chatbot" && (
            <ChatbotContainer>
              <MessageList messages={messages} />
              <MessageInput
                onSend={handleSend}
                showInitialSuggestions={false}
              />
            </ChatbotContainer>
          )}
        </ScrollableSidebarContent>
      </Sidebar>

      {modalOpen && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          navigate={() => navigate(PAGE_PATHS.HOME)}
        />
      )}
    </Container>
  );
};

export default LessonViewPage;
