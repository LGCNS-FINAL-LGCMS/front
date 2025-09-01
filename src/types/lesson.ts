export interface Lesson {
  id: string;
  index?: number;
  title: string;
  information: string;
  thumbnail?: string;
  videoUrl: string | null;
  playtime?: number | null;
  lectureId: string;
  createdAt: number[];
}
