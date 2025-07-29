import { useState } from 'react';
import styled from 'styled-components';
import Memo from '../Memo/Memo';
import LessonList from '../Lecture/LessonList';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TabList = styled.ul`
  display: flex;
  padding-left: 0;
  margin: 0;
`;

const TabItem = styled.li<{ $active: boolean }>`
  list-style: none;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: ${({ $active }) => ($active ? '#fff' : '#f2f2f2')};
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#000' : '#666')};
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#fff' : '#e6e6e6')};
  }
`;

const ContentBox = styled.div`
  height: 815px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0 8px 8px 8px;
  box-shadow: 2px 8px rgba(0, 0, 0, 0.04);
  overflow-y: auto;
`;

type TabData = {
  key: string;
  label: string;
  content: React.ReactElement;
};

const tabs: TabData[] = [
  { key: 'index', label: '강의 목차', content: <LessonList /> },
  { key: 'memo', label: '강의 메모', content: <Memo /> },
  { key: 'AI tutor', label: '튜터 챗봇', content: <div /> }
];

const Tab = () => {
    const [key, setKey] = useState<string>(tabs[0].key);

    const tab = tabs.find((tab) => tab.key === key);
  return(
    <Container>
      <TabList>
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            onClick={() => setKey(tab.key)}
            $active={tab.key === key}
          >
            {tab.label}
          </TabItem>
        ))}
      </TabList>
      <ContentBox>{tab?.content}</ContentBox>
    </Container>

  )
};

export default Tab;
