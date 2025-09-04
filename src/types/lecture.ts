export interface Lecture {
  lectureId: string;
  nickname: string;
  description: string;
  title: string;
  price: number;
  thumbnail?: string | null;
  progress?: number | null;
  averageStar?: number | null;
  reviewCount?: number | null;
  information?: string;
}
