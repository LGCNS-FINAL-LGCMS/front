export interface Lesson {
  id: string;
  lectureId: string;
  title: string;
  information: string;
  videoUrl: string;
  thumbnail: string;
  playtime: number;
  progress: number | null;
  createdAt: [number, number, number, number, number, number, number];
}
