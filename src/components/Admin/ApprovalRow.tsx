import React from 'react';
import type { InstructorRequest } from '../../types/InstructorRequest';
import Button from '../Common/Button';
import { ActionRow, Td, TrBody } from './ApprovalTable';
import styled from 'styled-components';

interface Props {
    index: number;
    item: InstructorRequest;
    onApprove: (id: number) => void;
}

const NewTag = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px 6px;
  margin-left: 8px;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background-color: ${({ theme }) => theme.colors.danger};
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
`;



const ApprovalRowBase: React.FC<Props> = ({ index, item, onApprove }) => {
    const disabled = item.status !== '요청';

    const handleApproveClick = () => {
        onApprove(item.id); // 모달열기
    };
    // TODO: role이 STUDENT인 경우만 표시하기
    // TODO: desirerLecturer가 true인경우만 표시하기


    return (


        <TrBody>


            <Td align="center">{index} {item.isNew && <NewTag>NEW</NewTag>}</Td>
            <Td align="center">{item.requester}</Td>
            <Td align="center">{item.status}</Td>
            <Td align="center">{item.requestedAt}</Td>
            <Td align="center">
                <ActionRow>

                    <Button
                        onClick={handleApproveClick}
                        text="승인"
                        design={2}
                        fontColor={2}
                        fontWeight={400}
                        title="강사 승인 요청"
                        disabled={disabled}
                    />
                </ActionRow>
            </Td>

        </TrBody>


    );
}

// 행 단위만 상태가 바뀔 때 리랜더(memo)
// 전체 테이블이 리랜더될 때는 ApprovalTable에서 관리
export const ApprovalRow = React.memo(ApprovalRowBase);
