import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { fetchFaqList, type FaqItem } from "../../redux/FaqData/FaqDataSlice";
import QnaCard from "../../components/Common/QnaCard";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height});
  font-family: ${(props) => props.theme.font.primary};
`;

const FaqTitle = styled.h1`
  width: ${(props) => props.theme.size.bottomLine};
  font-size: ${({ theme }) => theme.fontSize.title.max};
  color: ${({ theme }) => theme.colors.text_D};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border_Dark};
  padding: 10px 0;
`;

const FaqCardSection = styled.div`
  font-family: ${(props) => props.theme.font.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 18px;
  max-width: 800px;
  margin: 0 auto;
`;

const FaqPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const faqListData = useSelector((state: RootState) => state.faqData.faqList);

  useEffect(() => {
    dispatch(fetchFaqList());
  }, [dispatch]);

  return (
    <FAQContainer>
      <FaqTitle>FAQ</FaqTitle>
      <FaqCardSection>
        {faqListData.map((faq: FaqItem) => (
          <QnaCard
            key={faq.id}
            id={faq.id}
            question={faq.question}
            answer={faq.answer}
            design={1}
          />
        ))}
      </FaqCardSection>
    </FAQContainer>
  );
};

export default FaqPage;
