import React from 'react'; // useState 훅이 필요 없어지므로 제거
import type { InstructorRequest } from '../../types/InstructorRequest';
import styled from 'styled-components';
import { ApprovalRow } from './ApprovalRow';

interface Props {
  items: InstructorRequest[];
  onApprove: (id: number) => void;
}

export const Board = styled.div`
  background: ${({ theme }) => theme.colors.background_B};
  border: 1px solid ${({ theme }) => theme.colors.border_Dark};
  border-radius: 8px;
  box-shadow: 0 1px 2px ${({ theme }) => theme.shadow.lg};
  height: 450px; 
  position: relative;
  width: 800px;
  margin: auto;

  overflow-y: auto; 

  &::-webkit-scrollbar {
    width: 6px; 
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.background_D}; 
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background_B}; 
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  padding-right: 6px;
`;

export const TrHead = styled.tr`
  background: ${({ theme }) => theme.colors.background_B};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border_Dark};
  position: sticky; 
  top: 0;
  z-index: 1;
`;

export const TrBody = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border_Dark};
  background: ${({ theme }) => theme.colors.secondary};
  transition: ${({ theme }) => theme.transition.default};
  &:hover {
    background: ${({ theme }) => theme.colors.success};
  }


`;

export const TrEmpty = styled.tr`
  height: 220px;
`;

export const Th = styled.th`
  padding: 12px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_D};
  font-weight: 600;
  text-align: center;
`;

export const Td = styled.td<{ align?: 'left' | 'center' | 'right' }>`
  padding: 12px 14px;
  font-size: 14px;
  text-align: ${({ align }) => align ?? 'left'};
  word-break: break-word;
  color: ${({ theme }) => theme.colors.text_D};
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const ApprovalTable: React.FC<Props> = ({ items, onApprove }) => {
  return (
    <Board>
      <Table role="table" aria-label="강사 승인 요청 목록">
        <thead>
          <TrHead>
            <Th style={{ width: 80 }}>멤버ID</Th>
            <Th>닉네임</Th>
            <Th style={{ width: 120 }}>상태</Th>
            <Th style={{ width: 160 }}>요청일</Th>
            <Th style={{ width: 120 }}>상세보기</Th>
          </TrHead>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <ApprovalRow key={item.id} index={item.id} item={item} onApprove={onApprove} />
            ))
          ) : (
            <TrEmpty>
              <Td colSpan={5} align="center">승인 대기 중인 요청이 없습니다.</Td>
            </TrEmpty>
          )}
        </tbody>
      </Table>
    </Board>
  );
};

export default ApprovalTable;