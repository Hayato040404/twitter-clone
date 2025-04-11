import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memoryStore } from "@/lib/memoryStore";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const receiverId = searchParams.get("receiverId");
  if (!receiverId) {
    return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
  }

  const messages = Array.from(memoryStore.messages.values()).filter(
    (msg) =>
      (msg.senderId === session.user.id && msg.receiverId === receiverId) ||
      (msg.senderId === receiverId && msg.receiverId === session.user.id)
  );

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { receiverId, content } = await req.json();
  if (!receiverId || !content) {
    return NextResponse.json({ error: "Receiver ID and content are required" }, { status: 400 });
  }

  const message = {
    id: Date.now().toString(),
    senderId: session.user.id,
    receiverId,
    content,
    createdAt: new Date(),
  };
  memoryStore.messages.set(message.id, message);

  const user = memoryStore.users.get(session.user.id)!;
  memoryStore.notifications.set(receiverId, {
    id: Date.now().toString(),
    userId: receiverId,
    type: "dm",
    fromUser: user, // fromUserId から fromUser に変更
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "Message sent" });
}
