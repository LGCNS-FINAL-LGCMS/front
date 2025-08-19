// InterestSelector.tsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { theme } from "../../assets/styles/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Interest } from "../../types/interset";

type Props = {
  interests: Interest[];
  onSelectionChange?: (selected: Interest[]) => void;
  initialSelected?: Interest[];
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 500px;
  justify-content: center;
  align-items: flex-start;
`;

const InterestButton = styled.button<{ selected: boolean }>`
  padding: 4px 10px;
  border-radius: 12px;
  height: 30px;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  font-weight: 700;
  border: 3px solid
    ${({ selected }) =>
      selected ? theme.colors.border_Dark : theme.colors.gray_M};
  background-color: ${({ selected }) =>
    selected ? theme.colors.header : theme.colors.background_B};
  color: ${({ selected }) =>
    selected ? theme.colors.text_B : theme.colors.text_D};
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  span {
    margin-right: 3px;
    color: ${({ selected }) =>
      selected ? theme.colors.text_B : theme.colors.text_D};
    font-weight: 700;
  }

  &:hover {
    background-color: ${({ selected }) =>
      selected ? theme.colors.gray_D : theme.colors.background_B};
  }
`;

/**
 * 공통 관심사 컴포넌트입니다.
 *
 * @param interests 관심사 아이템들 (필수)
 * @param onSelectionChange 선택값이 변경될 때 호출되는 콜백 (선택)
 * @param initialSelected 처음부터 선택된 관심사 배열 (선택)
 *
 * 사용 예시:
 *
 * import { useState, useCallback } from "react";
 * import InterestSelector from "./InterestSelector";
 * import type { Interest } from "../../types/interest";
 *
 * const interests: Interest[] = [
 *   { id: 1, name: "리액트" },
 *   { id: 2, name: "자바스크립트" },
 *   { id: 3, name: "CSS" },
 *   { id: 4, name: "C#" },
 *   { id: 5, name: "넵" },
 * ];
 *
 * const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
 *
 * const handleSelectionChange = useCallback((selected: Interest[]) => {
 *   setSelectedInterests(selected);
 * }, []);
 *
 */

const InterestSelector: React.FC<Props> = ({
  interests,
  onSelectionChange,
  initialSelected = [],
}) => {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(initialSelected.map((i) => i.id))
  );
  const prevSelectedRef = useRef<number[]>([]);

  useEffect(() => {
    if (!onSelectionChange) return;

    const selectedItems = interests.filter((i) => selected.has(i.id));
    const selectedIds = selectedItems.map((i) => i.id).sort((a, b) => a - b);
    const prevIds = [...prevSelectedRef.current].sort((a, b) => a - b);

    const isSame =
      selectedIds.length === prevIds.length &&
      selectedIds.every((id, index) => id === prevIds[index]);

    if (!isSame) {
      prevSelectedRef.current = selectedIds;
      onSelectionChange(selectedItems);
    }
  }, [selected, interests, onSelectionChange]);

  const toggleInterest = (id: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <Container>
      {interests.map((interest) => {
        const isSelected = selected.has(interest.id);
        return (
          <InterestButton
            key={interest.id}
            selected={isSelected}
            onClick={() => toggleInterest(interest.id)}
          >
            <span>
              <FontAwesomeIcon icon={isSelected ? faCheck : faPlus} />
            </span>
            {interest.name}
          </InterestButton>
        );
      })}
    </Container>
  );
};

export default InterestSelector;
