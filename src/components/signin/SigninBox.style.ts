import styled from "styled-components";

export const SigninBoxContainer = styled.div`
  flex-direction: center;
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 30px 50px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 40px;
  width: 40dvw;
  height: 80dvh;
  overflow-y: auto;
`;

export const SigninBoxTitle = styled.h1`
  text-align: center;
  padding-bottom: 10px;
  justify-content: center;
`;

export const SigninBoxNickname = styled.div`
  margin: 50px;

  button {
    margin-left: "10px";
    font-size: "14px";
  }
`;

export const Input = styled.input`
  width: 40%;
  height: 50%;
  padding: 7px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

export const CheckButton = styled.button`
  margin-left: 10px;
`;

export const CheckMessage = styled.p`
  font-size: 12px;
`;

export const SigninBoxCategory = styled.div`
  margin: 50px;
`;

export const CategorySelect = styled.div`
  > div {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 5px;
  }

  select {
    flex: 1;
    padding: 7px 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    align-items: center;
  }

  .add-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Deletebutton = styled.button``;

export const SigninButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;
