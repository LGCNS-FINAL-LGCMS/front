import React, { useMemo } from "react";
import styled from "styled-components";
import { deleteCart } from "../../api/Payment/cartAPI";

import { getTableKit } from "./Table";
import type { LectureItem } from "../../pages/PaymentPage/PaymentPage";
const T = getTableKit("v2");

type ProductListProps = {
  items: LectureItem[];
  setItems: React.Dispatch<React.SetStateAction<LectureItem[]>>;
};

const ProductList: React.FC<ProductListProps> = ({ items, setItems }) => {
  const totalCount = items.length;
  const selectedCount = items.filter((i) => i.selected).length;

  // 선택된 항목이 하나 이상이면 선택분만 합계, 아니면 0
  const subtotal = useMemo(() => {
    const source = selectedCount > 0 ? items.filter((i) => i.selected) : [];
    return source.reduce((sum, it) => sum + it.price, 0);
  }, [items, selectedCount]);

  const allChecked = totalCount > 0 && selectedCount === totalCount;
  const indeterminate = selectedCount > 0 && selectedCount < totalCount;

  const toggleAll = () => {
    const next = !allChecked;
    setItems((prev) => prev.map((it) => ({ ...it, selected: next })));
  };

  const toggleOne = (id: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.lectureId === id ? { ...it, selected: !it.selected } : it
      )
    );
  };

  const removeOne = async (id: number) => {
    // 백에서 지우기
    console.log("삭제할 id:", id);
    const result = await deleteCart(id);
    console.log(result);

    // 프론트에서 지우기 (새로고침하면 백에서 지워진채로 불러옴. 새로고침안하고 리랜더 표시하려고 이렇게 함)
    setItems((prev) => prev.filter((it) => it.cartId !== id));
  };

  // 전체삭제는 api가 없어서 구현하지 않았습니다.
  // const removeSelected = () => {
  //     setItems(prev => prev.filter(it => !it.selected));
  // };

  // const clearAll = () => {
  //     setItems([]);
  // };

  return (
    <Wrap>
      {/* 상단 요약 바 */}
      <TopBar>
        <LeftGroup>
          <CheckBox
            type="checkbox"
            checked={allChecked}
            aria-checked={indeterminate ? "mixed" : allChecked}
            onChange={toggleAll}
          />
          <CountText>
            장바구니에 {totalCount.toLocaleString()}개 상품이 있습니다
          </CountText>
        </LeftGroup>
      </TopBar>

      {/* 표 본문: 공용 테이블 V2 + colgroup으로 폭 지정 */}
      <T.Board>
        <T.Table role="table" aria-label="장바구니 강의 목록">
          <colgroup>
            <col style={{ width: 56 }} /> {/* 체크박스 */}
            <col style={{ width: 68 }} /> {/* 썸네일 */}
            <col style={{ width: "auto" }} /> {/* 제목/강사명 */}
            <col style={{ width: 160 }} /> {/* 가격/제거 */}
          </colgroup>

          <tbody>
            {items.length === 0 ? (
              <T.TrEmpty>
                <T.Td colSpan={4} align="center">
                  장바구니가 비어 있습니다.
                </T.Td>
              </T.TrEmpty>
            ) : (
              items.map((it) => (
                <T.TrBody key={it.lectureId}>
                  {/* 체크박스 */}
                  <T.Td align="center">
                    <CheckBox
                      type="checkbox"
                      checked={it.selected}
                      onChange={() => toggleOne(it.lectureId)}
                      aria-label={`${it.title} 선택`}
                    />
                  </T.Td>

                  {/* 썸네일 */}
                  <T.Td >

                    <Thumb $imageUrl={encodeURI(it.thumbnailUrl) || undefined} />

                  </T.Td>

                  {/* 강의 정보 */}
                  <T.Td>
                    <Title>{it.title}</Title>
                  </T.Td>

                  {/* 가격 + 제거 */}
                  <T.Td align="right">
                    <Price>{it.price.toLocaleString()} ₩</Price>
                    <RemoveLink type="button" onClick={() => removeOne(it.cartId)}>
                      🗑
                    </RemoveLink>
                  </T.Td>
                </T.TrBody>
              ))
            )}
          </tbody>
        </T.Table>
      </T.Board>

      {/* 하단 합계/액션 바 */}
      <BottomBar>
        <Subtotal>
          소계 ( 강의 {(selectedCount > 0 ? selectedCount : 0).toLocaleString()}{" "}
          개): {subtotal.toLocaleString()} ₩
        </Subtotal>
      </BottomBar>
    </Wrap>
  );
};

export default ProductList;

// 스타일 컴포넌트

const Wrap = styled.div``;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  border-radius: 8px 8px 0 0;
`;
const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const CountText = styled.div`
  font-weight: 700;
`;

const CheckBox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const Thumb = styled.div<{ $imageUrl?: string }>`
  width: 90px;
  aspect-ratio: 16 / 9;

  background-color: ${({ theme }) => theme.colors.gray_M};
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${({ $imageUrl }) =>
    $imageUrl ? `url(${$imageUrl})` : "none"};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const Title = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.background_D};
  margin-bottom: 4px;
`;
const Price = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.background_D};
  margin-bottom: 6px;
`;
const RemoveLink = styled.button`
  background: none;
  border: 0;
  padding: 0;
  font-size: 16px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    transform: scale(1.3);
  }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border_Light};
  border-top: none;
  border-radius: 0 0 8px 8px;
`;

const Subtotal = styled.div`
  font-weight: ${({ theme }) => theme.fontSize.subtitle};
  color: ${({ theme }) => theme.colors.text_D};
`;
