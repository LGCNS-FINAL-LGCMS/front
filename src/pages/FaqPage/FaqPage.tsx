import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { fetchFaqList, type FaqItem } from "../../redux/FaqData/FaqDataSlice";
import QnaCard from "../../components/Common/QnaCard";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";

const FAQContainer = styled.div`
  font-family: ${(props) => props.theme.font.primary};
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

const FaqTitle = styled.div`
  border-bottom: 2px solid;
  width: 1080px;
  font-size: ${(props) => props.theme.fontSize.title.max};
  font-family: ${(props) => props.theme.font.primary};
  border-color: ${(props) => props.theme.colors.border_Dark};
  margin: 0 auto 30px auto; /* 👈 좌우 auto로 가운데 정렬! */
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
