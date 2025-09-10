import apiClient from "../index";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { getErrorMessage } from "../../utils/handleApiError";
import type { Notification } from "../../types/notification";

export const getNotification = async (): Promise<Notification[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.GET);

    const notifications: Notification[] =
      response.data?.data?.notifications ?? [];

    return notifications;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "기존 알림 불러오기 실패");
    throw new Error(message);
  }
};

export const readNotificationRequest = async (id: string) => {
  try {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.NOTIFICATION.DELETE}?notificationId=${id}`
    );
    return response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "알림 읽기 실패");
    throw new Error(message);
  }
};
