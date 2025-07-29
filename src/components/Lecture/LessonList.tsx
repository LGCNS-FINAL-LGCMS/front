// src/components/Lecture/LessonList.tsx

import styled from 'styled-components';
import LessonItem from './LessonItem';
import { useEffect, useState } from 'react';

const ListWrapper = styled.div`
  padding-top: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// 👉 하드코딩된 더미 데이터
const dummyData: LessonInfo[] = [
  {
    title: 'React 기초',
    lecture: '컴포넌트 이해하기',
    duration: '25분',
  },
  {
    title: 'Styled Components',
    lecture: '스타일 선언 방식',
    duration: '18분',
  },
  {
    title: 'TypeScript',
    lecture: '타입 시스템 소개',
    duration: '30분',
  },
  {
    title: 'React 기초',
    lecture: '컴포넌트 이해하기',
    duration: '25분',
  },
  {
    title: 'React 기초',
    lecture: '컴포넌트 이해하기',
    duration: '25분',
  },
  {
    title: 'Styled Components',
    lecture: '스타일 선언 방식',
    duration: '18분',
  },
  {
    title: 'TypeScript',
    lecture: '타입 시스템 소개',
    duration: '30분',
  },
  {
    title: 'React 기초',
    lecture: '컴포넌트 이해하기',
    duration: '25분',
  },
  {
    title: 'React 기초',
    lecture: '컴포넌트 이해하기',
    duration: '25분',
  },
  {
    title: 'Styled Components',
    lecture: '스타일 선언 방식',
    duration: '18분',
  },
  {
    title: 'TypeScript',
    lecture: '타입 시스템 소개',
    duration: '30분',
  },
  {
    title: 'Styled Components',
    lecture: '스타일 선언 방식',
    duration: '18분',
  },
  {
    title: 'TypeScript',
    lecture: '타입 시스템 소개',
    duration: '30분',
  },
  {
    title: 'TypeScript',
    lecture: '타입 시스템 소개',
    duration: '30분',
  },
  {
    title: 'TypeScript',
    lecture: '타입 시스템 소개',
    duration: '30분',
  },
  {
    title: 'TypeScript',
    lecture: '타입 시스템 소개',
    duration: '30분',
  }
];

type LessonInfo ={
    title: string;
    lecture: string;
    duration: string;
};

const LessonList = () => {
    const [ lecture, setLecture ] = useState<LessonInfo[]>(dummyData);

//     // api 연동부분 수정필요
// useEffect(() => {
//     const fetchData = async() => {
//         const respones = await fetch('/api/lesson');
//         const data: LessonInfo[] = await respones.json();
//         setLecture(data);
//     };
//     fetchData();
// }, []);

  return (
  <ListWrapper>
    {lecture.map((lecture, index) => (
        <LessonItem key={index} data={lecture} />
        ))}

  </ListWrapper>
)
};

export default LessonList;