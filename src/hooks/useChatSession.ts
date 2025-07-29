import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/message";

export const useChatSession = (url: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onmessage = (event) => {
      const message: ChatMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (content: string) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      content,
      timestamp: Date.now(),
    };
    socketRef.current?.send(JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
  };

  return { messages, sendMessage };
};
