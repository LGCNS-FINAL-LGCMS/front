export interface Lecture {
  id: number;
  description?: string;
  imageUrl?: string;
  lecturer?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  category?: string;
  rating?: number;
  durationMinutes?: number;
}
