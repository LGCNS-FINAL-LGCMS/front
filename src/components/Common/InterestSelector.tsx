// InterestSelector.tsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { theme } from "../../assets/styles/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";

type Interest = {
  id: string;
  name: string;
};

type Props = {
  interests: Interest[];
  onSelectionChange?: (selected: Interest[]) => void;
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
    ${({ selected }) => (selected ? theme.colors.primary : "#ccc")};
  background-color: ${({ selected }) =>
    selected ? "rgba(90, 155, 240, 1)" : "#fff"};
  color: ${theme.colors.text_D};
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  span {
    margin-right: 3px;
    color: ${({ selected }) =>
      selected ? "rgba(255, 255, 255, 1)" : "#000000ff"};
    font-weight: 700;
  }

  &:hover {
    background-color: ${({ selected }) =>
      selected ? "rgba(130, 184, 255, 0.85)" : theme.colors.background_B};
  }
`;

/**
 * 공통 관심사 컴포넌트입니다. *
 * @param interests 관심사 아이템들 (필수!!)
 * @param onSelectionChange 체크값 변경될때 발생하는 이벤트 (필수!)
 * 
 * 예시:
 * 
 * // 타입 지정(따로 빼도 됨)
 * type Interest = {
     id: string;
     name: string;
   };

   // 관심사 예시
   const interests = [
    { id: "dash1", name: "리액트" },
    { id: "dash2", name: "어쩌고 저쩌고" },
    { id: "dash3", name: "궁시렁" },
    { id: "dash4", name: "C#" },
    { id: "dash5", name: "넵" },
  ];

  // 이벤트
   const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
   const handleSelectionChange = useCallback((selected: Interest[]) => {
     setSelectedInterests(selected);
   }, []);


 */
const InterestSelector: React.FC<Props> = ({
  interests,
  onSelectionChange,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const prevSelectedRef = useRef<string[]>([]);

  useEffect(() => {
    if (!onSelectionChange) return;

    const selectedItems = interests.filter((i) => selected.has(i.id));
    const selectedIds = selectedItems.map((i) => i.id).sort();
    const prevIds = [...prevSelectedRef.current].sort();
    const isSame =
      selectedIds.length === prevIds.length &&
      selectedIds.every((id, index) => id === prevIds[index]);

    if (!isSame) {
      prevSelectedRef.current = selectedIds;
      onSelectionChange(selectedItems);
    }
  }, [selected, interests, onSelectionChange]);

  const toggleInterest = (id: string) => {
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
