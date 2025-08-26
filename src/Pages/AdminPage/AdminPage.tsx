import React, { useState, useEffect } from 'react';
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
    // { memberId: 1, nickname: 'User1', role: 'STUDENT', desireLecturer: true, requestedAt: '2024-10-01T10:00:00Z', categories: [] },
    // { memberId: 2, nickname: 'User2', role: 'STUDENT', desireLecturer: true, requestedAt: '2024-10-02T11:00:00Z', categories: [] },
    // { memberId: 3, nickname: 'User3', role: 'LECTURER', desireLecturer: true, requestedAt: '2024-10-03T12:00:00Z', categories: [] },
    // { memberId: 4, nickname: 'User4', role: 'STUDENT', desireLecturer: true, requestedAt: '2024-10-04T13:00:00Z', categories: [] },
    // { memberId: 5, nickname: 'User5', role: 'STUDENT', desireLecturer: true, requestedAt: '2024-10-05T14:00:00Z', categories: [] },
    // { memberId: 6, nickname: 'User6', role: 'LECTURER', desireLecturer: true, requestedAt: '2024-10-06T15:00:00Z', categories: [] },
    // { memberId: 7, nickname: 'User7', role: 'STUDENT', desireLecturer: true, requestedAt: '2024-10-07T16:00:00Z', categories: [] },
    // { memberId: 8, nickname: 'User8', role: 'STUDENT', desireLecturer: true, requestedAt: '2024-10-08T17:00:00Z', categories: [] },
    // { memberId: 9, nickname: 'User9', role: 'LECTURER', desireLecturer: false, requestedAt: '2024-10-09T18:00:00Z', categories: [] },
    // { memberId: 10, nickname: 'User10', role: 'STUDENT', desireLecturer: true, requestedAt: '2025-08-25T12:00:00Z', categories: [] },

  ]);



  const [viewList, setViewList] = useState<InstructorRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response: desirerResponse = await getDesirers();
      console.log(response.data);
      setList(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const currentItemIds = new Set<number>();

    const transformedList = list.map(item => {
      currentItemIds.add(item.memberId);

      const isNewItem = new Date().getTime() - new Date(item.requestedAt).getTime() < 24 * 60 * 60 * 1000;
      return {
        id: item.memberId,
        requester: item.nickname,
        requestedAt: item.requestedAt,
        status: item.desireLecturer ? '요청' : '승인됨',
        isNew: isNewItem,
      };
    }) as InstructorRequest[];

    transformedList.sort((a, b) => Number(b.isNew) - Number(a.isNew));

    setViewList(transformedList);
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

        // post요청
        const response: desirerResponse = await postConfirmDesirer([selectedItemId]);
        console.log('결과 : {}', response.data.forEach(item => (item.nickname)));

        // 표에서 제거
        setList(prev => prev.filter(item => item.memberId !== selectedItemId));

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