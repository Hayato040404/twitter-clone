import { WebSocketServer } from "ws";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export const GET = () => {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const { type, data } = JSON.parse(message.toString());
      if (type === "message") {
        const newMessage = {
          id: Date.now().toString(),
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          createdAt: new Date(),
        };
        memoryStore.messages.set(newMessage.id, newMessage);

        // クライアントにメッセージを送信
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: "message", data: newMessage }));
          }
        });

        // 通知を作成
        const notification = {
          id: Date.now().toString(),
          userId: data.receiverId,
          type: "dm",
          fromUser: memoryStore.users.get(data.senderId)!,
          createdAt: new Date(),
        };
        memoryStore.notifications.set(notification.id, notification);
      }
    });
  });

  return new Response("WebSocket server started", { status: 200 });
};
