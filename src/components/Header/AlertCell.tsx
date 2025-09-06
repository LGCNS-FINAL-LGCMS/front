import React from "react";
import styled from "styled-components";
import { theme } from "../../assets/styles/theme";
import type { Notification } from "../../types/notification";

const AlertItemWrapper = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${theme.colors.text_B};
  font-family: ${theme.font.primary};
  font-weight: 400;
  backdrop-filter: blur(5px);
  line-height: 1.6;
  &:hover {
    background-color: ${theme.colors.header};
  }
`;

interface AlertCellProps {
  item: Notification;
  onClick?: (item: Notification) => void;
}

// const formatDate = (createdAt: number[]) => {
//   const [year, month, day] = createdAt;
//   return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
//     2,
//     "0"
//   )}`;
// };

export const AlertCell: React.FC<AlertCellProps> = ({ item, onClick }) => {
  return (
    <AlertItemWrapper onClick={() => onClick?.(item)}>
      <div>{item.content}</div>
      {item.createdAt && (
        <small style={{ fontSize: "0.7rem", color: theme.colors.text_B }}>
          {item.createdAt}
        </small>
      )}
    </AlertItemWrapper>
  );
};
