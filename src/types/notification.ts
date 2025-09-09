export interface Notification {
  id: string;
  notificationType: string;
  memberId: number;
  content: string;
  webPath: string;
  createdAt: number[];
}
