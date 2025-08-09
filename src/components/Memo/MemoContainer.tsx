import { useEffect, useMemo, useState } from "react";
import Memo from "./Memo";
import type { MemoInfo } from "../../api/memoApi";
import { fetchMemos, createMemo, updateMemo, removeMemo } from "../../api/memoApi";

interface MemoContainerProps {
  lessonId: string;
}

const MemoContainer = ({ lessonId }: MemoContainerProps) => {
  const [memos, setMemos] = useState<MemoInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>(""); // 현재 선택된 메모 ID
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // ✅ 최초/lessonId 변경 시 목록 조회
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await fetchMemos(lessonId);
        setMemos(list);
        setSelectedId(list[0]?.id ?? "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [lessonId]);

  // ✅ 생성
  const handleAdd = async () => {
    try {
      setSaving(true);
      const newOne = await createMemo(lessonId, {
        title: `메모 ${memos.length + 1}`,
        content: "",
      });
      setMemos((prev) => [...prev, newOne]);
      setSelectedId(newOne.id);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // ✅ 수정(저장 버튼으로만 호출)
  const handleUpdate = async (id: string, content: string) => {
    try {
      setSaving(true);
      const updated = await updateMemo(lessonId, id, { content });
      setMemos((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // ✅ 삭제
  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      await removeMemo(lessonId, id);
      setMemos((prev) => prev.filter((m) => m.id !== id));
      // 다음 선택자 갱신
      setSelectedId((prevSelected) => {
        if (prevSelected !== id) return prevSelected;
        const next = memos.filter((m) => m.id !== id);
        return next[0]?.id ?? "";
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // ✅ 선택
  const handleSelect = (id: string) => setSelectedId(id);

  // 로딩 표시 등은 상위에서 처리 or 토스트 사용
  return (
    <Memo
      lessonId={lessonId}
      memos={memos}
      selectedId={selectedId}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onSelect={handleSelect}
    />
  );
};

export default MemoContainer;
