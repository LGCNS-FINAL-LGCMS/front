import styled from "styled-components";
import { useEffect, useState } from "react";

import QuestionCard from "../../../components/Qna/QuestionCard";
import { getMemberQnas } from "../../../api/Qna/qnaAPI";
import type { Qna } from "../../../types/qna";

const Container = styled.div`
  font-family: ${(props) => props.theme.font.primary};
`;

const StudentQnaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height});
  font-family: ${(props) => props.theme.font.primary};
`;

const MypageTitle = styled.h1`
  width: ${(props) => props.theme.size.bottomLine};
  font-size: ${({ theme }) => theme.fontSize.title.max};
  color: ${({ theme }) => theme.colors.text_D};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border_Dark};
  padding: 10px 0;
`;

const Qnasection = styled.div`
  font-size: ${(props) => props.theme.fontSize.title.min};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const QnaTitle = styled.p`
  margin-bottom: 20px;
  padding: 0.5rem 2rem;
  border-radius: 12px;
  width: 1000px;

  background-color: #fff;
  box-shadow: ${({ theme }) => theme.shadow.md};
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 1px;
`;

const QnaListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 20px;
`;

const CardWrapper = styled.div`
  width: 100%;
  max-width: 700px;

  > div {
    width: 100% !important;
  }
`;

const EmptyMessage = styled.p`
  font-size: ${(props) => props.theme.fontSize.title.min};
  margin: 50px;
`;

const StudentQnaPage = () => {
  const [memberQnaList, setMemberQnaList] = useState<Qna[]>([]);

  useEffect(() => {
    const getMemberQna = async () => {
      try {
        const result = await getMemberQnas();
        if (result) {
          setMemberQnaList(result);
        }
      } catch {
        return null;
      }
    };
    getMemberQna();
  }, []);

  return (
    <Container>
      <StudentQnaContainer>
        <MypageTitle>나의 Q&A</MypageTitle>
        <Qnasection>
          <QnaTitle>내가 한 질문들</QnaTitle>
          <QnaListWrapper>
            {memberQnaList.length > 0 ? (
              memberQnaList.map((qna: Qna) => (
                <CardWrapper key={qna.id}>
                  <QuestionCard qna={qna} />
                </CardWrapper>
              ))
            ) : (
              <EmptyMessage>아직 등록한 질문이 없습니다.</EmptyMessage>
            )}
          </QnaListWrapper>
        </Qnasection>
      </StudentQnaContainer>
    </Container>
  );
};

export default StudentQnaPage;
