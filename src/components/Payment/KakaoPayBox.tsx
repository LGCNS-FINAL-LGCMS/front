import React from 'react';
import styled from 'styled-components';
import kakaoPayIcon from '/payment_icon_yellow_small.png';




const PaymentContainer = styled.div`
  width: 320px;
  max-width: 90%;
  margin: 50px auto;
  padding: 24px;
  background-color: #ffff;
  border-radius: 16px;
  box-shadow:  ${({ theme }) => theme.shadow.md};
  text-align: left;
`;

const SectionTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text_D};
  margin-bottom: 4px;
`;

const PriceDisplay = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_D};
  margin-bottom: 24px;
  span {
    font-size: 20px;
    font-weight: 500;
  }
`;

const DetailText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray_M};
  margin-top: 4px;
`;

const KakaoPayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 80px;
  background-color: #ffff;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};

  margin: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.shadow.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px ${({ theme }) => theme.shadow.sm};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
    transform: none;

  }
`;

const KakaoPayIcon = styled.img`
  width: auto;
  height: auto;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border_Light};
  margin: 16px 0;
`;

/** 상위컴포넌트에서 데이터 받는 용도 **/
type LectureItem = {
  lectureId: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
  selected: boolean;
};

type ProductListProps = {
  items: LectureItem[];
  startKakaoAccount: (subtotal: number) => void;
}

const KakaoPayBox: React.FC<ProductListProps> = ({ items, startKakaoAccount }) => {
  // 합계/개수 정보
  // const subtotal = useSelector(selectTotal);  // 선택이 있으면 선택합, 없으면 전체합
  const selectedItems = items.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0)
  const selectedCount = selectedItems.length;

  // 결제 대상
  const allItems = items;

  const handleKakaoPayClick = async () => {
    if (allItems.length === 0) {
      alert('결제할 항목이 없습니다.');
      return;
    }

    // 상위 컴포넌트에서 결제처리하는 함수 실행
    startKakaoAccount(subtotal);
  };

  return (
    <PaymentContainer>

      <SectionTitle>소계 ({selectedCount}개 항목):</SectionTitle>
      <PriceDisplay>
        {subtotal.toLocaleString()}<span>₩</span>
      </PriceDisplay>

      <Divider />

      <SectionTitle>결제하기:</SectionTitle>
      <PriceDisplay>
        {subtotal.toLocaleString()}<span>₩</span>
      </PriceDisplay>
      <DetailText>세금/부가세는 결제 시 반영됩니다.</DetailText>

      <KakaoPayButton onClick={handleKakaoPayClick} disabled={selectedItems.length <= 0}>
        <KakaoPayIcon src={kakaoPayIcon} alt="Kakao Pay Icon" />

      </KakaoPayButton>
    </PaymentContainer>
  );
};

export default KakaoPayBox;