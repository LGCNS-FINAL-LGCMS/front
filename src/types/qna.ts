export interface Answer {
  answerId: number;
  content: string;
}

export interface Qna {
  id: number;
  title: string;
  content: string;
  answers: Answer[];
}
