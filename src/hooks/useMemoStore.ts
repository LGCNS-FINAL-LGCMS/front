import { useState, useEffect } from "react";

const MEMO_STORAGE_PREFIX = "lesson-memos-";

export interface MemoInfo {
  id: string;
  title: string;
  content: string;
}

export const useMemoStore = (lessonId: string) => {
  const storageKey = `${MEMO_STORAGE_PREFIX}${lessonId}`;
  const [memos, setMemos] = useState<MemoInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed: MemoInfo[] = JSON.parse(saved);
      setMemos(parsed);
      if (parsed.length > 0) setSelectedId(parsed[0].id);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(memos));
  }, [memos, storageKey]);

  const addMemo = () => {
    const newMemo: MemoInfo = {
      id: Date.now().toString(),
      title: `메모 ${memos.length + 1}`,
      content: "",
    };
    const updated = [...memos, newMemo];
    setMemos(updated);
    setSelectedId(newMemo.id);
  };

  const updateMemo = (content: string) => {
    setMemos(prev =>
      prev.map(memo =>
        memo.id === selectedId ? { ...memo, content } : memo
      )
    );
  };

  const deleteMemo = () => {
    const filtered = memos.filter(memo => memo.id !== selectedId);
    setMemos(filtered);
    if (filtered.length > 0) setSelectedId(filtered[0].id);
    else setSelectedId("");
  };

  const getSelectedMemo = () => memos.find(m => m.id === selectedId);
  const selectMemo = (id: string) => setSelectedId(id);

  return {
    memos,
    selectedId,
    addMemo,
    updateMemo,
    deleteMemo,
    selectMemo,
    getSelectedMemo,
  };
};
