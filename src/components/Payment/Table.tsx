import styled, { css } from 'styled-components';

type CellAlign = 'left' | 'center' | 'right';
type TableVersion = 'v1' | 'v2';

// css 공통부분
const tableBase = css`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;
const thBase = css`
  padding: 12px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_D};
  font-weight: 600;
  text-align: center;
`;
const tdBase = css<{ align?: CellAlign }>`
  padding: 12px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text_D};
  text-align: ${({ align }) => align ?? 'left'};
  word-break: break-word;
`;

/* 어드민페이지 사용 테이블 */
const BoardV1 = styled.div`
  background: ${({ theme }) => theme.colors.background_B};
  border: 1px solid ${({ theme }) => theme.colors.border_Dark};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px ${({ theme }) => theme.shadow.lg};
`;
const TableV1 = styled.table`${tableBase}`;
const TrHeadV1 = styled.tr`
  background: ${({ theme }) => theme.colors.background_B};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border_Dark};
`;
const TrBodyV1 = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border_Light};
  &:hover { background: ${({ theme }) => theme.colors.gray_L}; }
`;
const TrEmptyV1 = styled.tr`
    height: 220px;
`;
const ThV1 = styled.th`
    ${thBase}
`;
const TdV1 = styled.td<{ align?: CellAlign }>`
    ${tdBase}
`;


const BoardV2 = styled.div`
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px ${({ theme }) => theme.shadow.lg};
`;
const TableV2 = styled.table`${tableBase}`;
const TrHeadV2 = styled.tr`
  background: #f2f3f5;
  border-bottom: 1px solid #e9ecef;
`;
const TrBodyV2 = styled.tr`
  border-bottom: 1px solid #f1f3f5;
  &:hover { background: #fafbfc; }
`;
const TrEmptyV2 = styled.tr`
    height: 220px;
`;
const ThV2 = styled.th`
    ${thBase}
`;
const TdV2 = styled.td<{ align?: CellAlign }>`
    ${tdBase}
`;


export const Table1 = {
  Board: BoardV1,
  Table: TableV1,
  TrHead: TrHeadV1,
  TrBody: TrBodyV1,
  TrEmpty: TrEmptyV1,
  Th: ThV1,
  Td: TdV1,
};
export const Table2 = {
  Board: BoardV2,
  Table: TableV2,
  TrHead: TrHeadV2,
  TrBody: TrBodyV2,
  TrEmpty: TrEmptyV2,
  Th: ThV2,
  Td: TdV2,
};


export function getTableKit(version: TableVersion) {
  return version === 'v1' ? Table1 : Table2;
}