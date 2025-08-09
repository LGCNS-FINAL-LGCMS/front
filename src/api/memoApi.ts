
export interface MemoInfo {
  id: string;
  lessonId: string;
  title: string;
  content: string;
  updatedAt?: string;
}

const db = new Map<string, MemoInfo[]>();

// 임시 지연 함수 (네트워크 흉내)
const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

// ID 생성기
const uid = () => crypto?.randomUUID?.() ?? String(Date.now() + Math.random());

// 강좌별 초기 데이터 심기 (선택)
function seed(lessonId: string) {
  if (!db.has(lessonId)) {
    db.set(lessonId, [
      { id: uid(), lessonId, title: "메모 1", content: "첫 메모입니다." },
      { id: uid(), lessonId, title: "메모 2", content: "두 번째 메모입니다." },
    ]);
  }
}

export async function fetchMemos(lessonId: string): Promise<MemoInfo[]> {
  seed(lessonId);
  await delay();
  return [...(db.get(lessonId) ?? [])];
}

export async function createMemo(
  lessonId: string,
  payload: Partial<MemoInfo>
): Promise<MemoInfo> {
  await delay();
  const list = db.get(lessonId) ?? [];
  const newMemo: MemoInfo = {
    id: uid(),
    lessonId,
    title: payload.title ?? `메모 ${list.length + 1}`,
    content: payload.content ?? "",
  };
  db.set(lessonId, [...list, newMemo]);
  return newMemo;
}

export async function updateMemo(
  lessonId: string,
  id: string,
  payload: Partial<MemoInfo>
): Promise<MemoInfo> {
  await delay();
  const list = db.get(lessonId) ?? [];
  const next = list.map((m) => (m.id === id ? { ...m, ...payload } : m));
  db.set(lessonId, next);
  return next.find((m) => m.id === id)!;
}

export async function removeMemo(lessonId: string, id: string): Promise<void> {
  await delay();
  const list = db.get(lessonId) ?? [];
  db.set(lessonId, list.filter((m) => m.id !== id));
}