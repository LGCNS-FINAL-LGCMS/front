import { useEffect, useState } from "react";
import type { Notification } from "../../types/notification";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { EventSourcePolyfill } from "event-source-polyfill";

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

export const useSseConnect = () => {
  const [message, setMessage] = useState<Notification>();
  const accessToken = useSelector(
    (state: RootState) => state.token.accessToken
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.token.isAuthenticated
  );

  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    const eventSource = new EventSourcePolyfill(
      `${API_BASE_URL}${API_ENDPOINTS.NOTIFICATION.SUBSCRIBE}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        heartbeatTimeout: 1800000,
      }
    );

    eventSource.onmessage = (event) => {
      try {
        const data: Notification = JSON.parse(event.data);
        setMessage(data);
        console.log(data);
      } catch (err) {
        console.error("SSE 데이터 파싱 오류:", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [accessToken]);

  return message;
};
