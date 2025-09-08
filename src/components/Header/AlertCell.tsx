import React from "react";
import styled from "styled-components";
import type { Notification } from "../../types/notification";

const AlertItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.header || "#ffffff"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease,
    background-color 0.2s ease;
  font-family: ${({ theme }) => theme.font.primary};
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    background-color: ${({ theme }) => theme.colors.background_D || "#f5f5f5"};
  }
`;

const Content = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text_B};
  line-height: 1.5;
  word-break: break-word;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray_M};
  align-self: flex-end;
  margin-top: 0.25rem;
`;

interface AlertCellProps {
  item: Notification;
  onClick?: (item: Notification) => void;
}

const formatDateTime = (createdAt: number[]) => {
  const [year, month, day, hour = 0, minute = 0] = createdAt;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const AlertCell: React.FC<AlertCellProps> = ({ item, onClick }) => {
  return (
    <AlertItemWrapper onClick={() => onClick?.(item)}>
      <Content>{item.content}</Content>
      {item.createdAt && (
        <Timestamp>{formatDateTime(item.createdAt)}</Timestamp>
      )}
    </AlertItemWrapper>
  );
};
