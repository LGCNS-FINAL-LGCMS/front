import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import type { InstructorRequest } from '../../types/InstructorRequest';
import ApprovalTable from '../../components/Admin/ApprovalTable';
import ApprovalModal from '../../components/Admin/ApprovalModal';
import type { desirerResponseData } from '../../api/member/memberAPI';
import { getDesirers, type desirerResponse, postConfirmDesirer } from '../../api/member/memberAPI';

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray_L};
`;

const InnerWrapper = styled.div`
  max-width: 980px;
  margin: 40px auto;
  padding: 40px 16px;
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_D};
  margin: 0 0 16px 5vw;
`;

const AdminPage: React.FC = () => {
  const [list, setList] = useState<desirerResponseData[]>([
    { memberId: 1666, nickname: '코딩마법사_김민준', role: 'STUDENT', desireLecturer: true, categories: [{ id: 1, name: '웹 개발' }, { id: 2, name: '앱 개발' }] },
    { memberId: 232, nickname: '리액트_장인_이서연', role: 'STUDENT', desireLecturer: true, categories: [{ id: 3, name: '프론트엔드' }] },
    { memberId: 31414, nickname: '파이썬_킹_박도윤', role: 'STUDENT', desireLecturer: true, categories: [{ id: 4, name: '백엔드' }] },
    { memberId: 47865, nickname: '데이터_분석가_최하은', role: 'STUDENT', desireLecturer: false, categories: [{ id: 5, name: '데이터 사이언스' }] },
    { memberId: 51111, nickname: '자바스크립트_고수_정우진', role: 'STUDENT', desireLecturer: true, categories: [{ id: 1, name: '웹 개발' }] },
    { memberId: 6, nickname: '디자인_천재_한우', role: 'STUDENT', desireLecturer: true, categories: [{ id: 6, name: 'UI/UX 디자인' }] },
    { memberId: 74, nickname: '인공지능_박사_강하늘', role: 'STUDENT', desireLecturer: true, categories: [{ id: 7, name: '인공지능' }] },
    { memberId: 8, nickname: '게임_개발자_지망생_고은서', role: 'STUDENT', desireLecturer: true, categories: [{ id: 8, name: '게임 개발' }] },
    { memberId: 966, nickname: '클라우드_전문가_신지원', role: 'STUDENT', desireLecturer: true, categories: [{ id: 9, name: '클라우드' }] },
    { memberId: 1440, nickname: '보안_전문가_윤서현', role: 'STUDENT', desireLecturer: true, categories: [{ id: 10, name: '정보 보안' }] },
    { memberId: 11, nickname: '데브옵스_마스터_임준혁', role: 'STUDENT', desireLecturer: true, categories: [{ id: 11, name: '데브옵스' }] },
    { memberId: 12, nickname: '풀스택_개발자_장예원', role: 'STUDENT', desireLecturer: true, categories: [{ id: 1, name: '웹 개발' }, { id: 4, name: '백엔드' }] },
    { memberId: 124, nickname: 'ak마스터', role: 'STUDENT', desireLecturer: true, categories: [] },
    { memberId: 12466, nickname: '뷰의 제왕 장은혁', role: 'STUDENT', desireLecturer: true, categories: [] },
    { memberId: 16244, nickname: 'ak마스터', role: 'STUDENT', desireLecturer: true, categories: [] },
  ]);

  // localStorage에서 이전에 확인한 item ID들을 가져와 Set으로 초기화
  // 초기렌더링시 한번 실행
  const [oldItemIds, setOldItemIds] = useState<Set<number>>(() => {
    try {
      const item = window.localStorage.getItem('viewedInstructorRequests');
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error('Failed to parse oldItemIds from localStorage', error);
      return new Set();
    }
  });


  const [viewList, setViewList] = useState<InstructorRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // oldItemIds 상태가 변경될 때마다 localStorage에 자동으로 저장

  useEffect(() => {
    try {
      window.localStorage.setItem('viewedInstructorRequests', JSON.stringify(Array.from(oldItemIds)));
    } catch (error) {
      console.error('Failed to save oldItemIds to localStorage', error);
    }
  }, [oldItemIds]);


  useEffect(() => {
    const currentItemIds = new Set<number>();

    const transformedList = list.map(item => {
      currentItemIds.add(item.memberId);
      // oldItemIds에 포함되어 있지 않으면 새로운 아이템
      const isNewItem = !oldItemIds.has(item.memberId);
      return {
        id: item.memberId,
        requester: item.nickname,
        requestedAt: new Date().toLocaleDateString('ko-KR').slice(0, -1),
        status: item.desireLecturer ? '요청' : '승인됨',
        isNew: isNewItem,
      };
    }) as InstructorRequest[];

    transformedList.sort((a, b) => Number(b.isNew) - Number(a.isNew));

    setViewList(transformedList);

    // 업데이트
    setOldItemIds(prevIds => {
      const updatedIds = new Set(prevIds);
      currentItemIds.forEach(id => updatedIds.add(id));
      return updatedIds;
    });
  }, [list]);


  // TODO: 실제 API 호출 로직을 useEffect 내부에 작성하세요.
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await getDesirers();
  //       setList(response.data); 
  //     } catch (error) {
  //       console.error('API 호출 실패:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);


  const handleApprove = (id: number) => {
    setSelectedItemId(id);
    setIsModalOpen(true);
  };


  const approveConfirm = async () => {
    if (selectedItemId !== null) {
      const itemToApprove = list.find(item => item.memberId === selectedItemId);
      if (itemToApprove?.role === 'LECTURER') {
        console.log("이미 처리된 요청입니다.");
      } else {
        alert("승인되었습니다!(실제로직은없습니다)");

        setList(prev =>
          prev.map(item =>
            item.memberId === selectedItemId ? { ...item, desireLecturer: false } : item
          )
        );
        // 표에서 제거
        setList(prev => prev.filter(item => item.memberId !== selectedItemId));

        // post요청
        // const response: desirerResponse = await postConfirmDesirer([selectedItemId]);
        // console.log('결과 : {}', response.data.forEach(item => (item.nickname)));

      }
      setIsModalOpen(false);
      setSelectedItemId(null);
    }
  };

  return (
    <>
      <PageTitle> 강사 승인</PageTitle>
      <hr />
      <Wrapper>
        <InnerWrapper>
          <ApprovalTable items={viewList} onApprove={handleApprove} />
        </InnerWrapper>
        <ApprovalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={approveConfirm}
        />
      </Wrapper>
    </>
  );
};

export default AdminPage;