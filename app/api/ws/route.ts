import { Server } from "ws";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: any }) {
  const { socket, response } = (req as any).raw;

  if (!socket.server.wss) {
    const wss = new Server({ noServer: true });
    socket.server.wss = wss;

    wss.on("connection", (ws) => {
      ws.on("message", (message) => {
        try {
          const { senderId, receiverId, content } = JSON.parse(message.toString());
          const id = Math.random().toString(36).slice(2);
          memoryStore.messages.set(id, {
            id,
            senderId,
            receiverId,
            content,
            createdAt: new Date(),
          });
          memoryStore.notifications.set(Math.random().toString(36).slice(2), {
            id: Math.random().toString(36).slice(2),
            userId: receiverId,
            type: "dm",
            fromUserId: senderId,
            createdAt: new Date(),
          });
          wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({
                  type: "message",
                  data: { id, senderId, receiverId, content },
                })
              );
            }
          });
        } catch (e) {
          console.error("WebSocket error:", e);
        }
      });
    });

    socket.server.on("upgrade", (request: any, socket: any, head: any) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });
  }

  return new Response(null, { status: 101 });
}
