"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MessageChat({ receiverId }: { receiverId: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { data: fetchedMessages } = useSWR(
    receiverId ? `/api/message?receiverId=${receiverId}` : null,
    fetcher
  );

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `wss://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ws`
        : "ws://localhost:3000/api/ws"
    );
    socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (
        type === "message" &&
        ((data.senderId === session?.user.id && data.receiverId === receiverId) ||
          (data.senderId === receiverId && data.receiverId === session?.user.id))
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };
    setWs(socket);
    return () => socket.close();
  }, [session, receiverId]);

  const sendMessage = async () => {
    if (!content || !ws || !session) return;
    ws.send(JSON.stringify({ senderId: session.user.id, receiverId, content }));
    setContent("");
  };

  if (!session) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="p-4 h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.senderId === session.user.id ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block p-2 rounded-lg ${
                msg.senderId === session.user.id
                  ? "bg-twitter text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Send a message..."
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:ring-twitter"
        />
      </div>
    </div>
  );
}
