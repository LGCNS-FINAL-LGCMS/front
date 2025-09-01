export interface InstructorRequest {
  id: number;
  requester: string;
  requestedAt: string; // 'YYYY.MM.DD' 형태
  status: '요청' | '승인됨';
  isNew?: boolean; // 새로운 것인지 표시하기
}