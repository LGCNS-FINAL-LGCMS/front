// src/pages/LectureWatchingPage.tsx

import { useState } from 'react';
import styled from 'styled-components';

import Tab from '../components/Tab/Tab';
import LessionViewer from '../components/Lecture/LectureViewer';
import LectureMeta from '../components/Lecture/LectureMeta';

interface ContainerProps {
  $showTab: boolean;
}

const Container = styled.div<ContainerProps>`
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: ${({ $showTab }) =>
    $showTab ? '7.5fr 2.2fr 0.3fr' : '9.7fr 0.3fr'};
    grid-gap: 15px;
    position: relative;

`;

const Viewer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

`;

const MetaWrapper = styled.div`
  flex: 1;
  overflow-y: auto;

`;

const Side = styled.div`
  height: 100%;
`;

const ToggleButton = styled.button`
  top: 20px;
  right: 20px;
  z-index: 10;
  padding: 8px 12px;
  background: none;
  color: black;
  border: none;
  cursor: pointer;
`;


const LectureWatchingPage = () => {
    const [showTab, setShowTab] = useState(true);

    const dummyLectureMeta = {
          lecture: "React 기초",
          lesson: "컴포넌트 이해하기",
          name: "김개발",
          desc: "웁니다.React의 핵심 개념인 컴포방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고React의개념인 컴포방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고React의개념인 컴포방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고React의개념인 컴포방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고React의개념인 컴포방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고React의개념인 컴포방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고React의 핵심 개념인 컴포넌트를 학습하고React의 핵심 개념인 컴포넌트를 학습하고React의 핵심 개념인 컴포넌트를 학습하고React의 핵심 개념인 컴포넌트를 학습하고React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.React의 핵심 개념인 컴포넌트를 학습하고, 실제 UI를 구성하는 방법을 배웁니다.",
          time: "25분",
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        };

  return (
        <Container $showTab={showTab}>
            <Viewer>
                <LessionViewer url={dummyLectureMeta.url} />
              <MetaWrapper>
                <LectureMeta
                  lecture={dummyLectureMeta.lecture}
                  lesson={dummyLectureMeta.lesson}
                  name={dummyLectureMeta.name}
                  desc={dummyLectureMeta.desc}
                  time={dummyLectureMeta.time}
                  />
              </MetaWrapper>
            </Viewer> 
            {showTab && 
            <Side>
                <Tab />
            </Side>
            }

            <ToggleButton onClick={() => setShowTab(!showTab)}>
                {showTab ? '▷' : '◀︎'}
            </ToggleButton>
      </Container>
  )
};

export default LectureWatchingPage;