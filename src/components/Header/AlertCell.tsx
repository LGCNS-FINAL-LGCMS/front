import React from "react";
import styled from "styled-components";
import { theme } from "../../assets/styles/theme";

const AlertItemWrapper = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${theme.colors.text_B};
  font-family: ${theme.font.primary};
  font-weight: 400;
  line-height: 1.6;
  &:hover {
    background-color: ${theme.colors.header};
  }
`;

interface AlertCellProps {
  message: string;
  date?: string;
  url?: string;
  onClick?: () => void;
}

const AlertCell: React.FC<AlertCellProps> = ({ message, date, onClick }) => {
  return (
    <AlertItemWrapper onClick={onClick}>
      <div>{message}</div>
      {date && (
        <small style={{ fontSize: "0.7rem", color: theme.colors.text_B }}>
          {date}
        </small>
      )}
    </AlertItemWrapper>
  );
};

export default AlertCell;
