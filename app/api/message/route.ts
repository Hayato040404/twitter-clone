import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { memoryStore } from "@/lib/memoryStore";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { receiverId, content } = await request.json();
  const receiver = memoryStore.users.get(receiverId);
  if (!receiver) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const id = Math.random().toString(36).slice(2);
  memoryStore.messages.set(id, {
    id,
    senderId: session.user.id,
    receiverId,
    content,
    createdAt: new Date(),
  });
  memoryStore.notifications.set(Math.random().toString(36).slice(2), {
    id: Math.random().toString(36).slice(2),
    userId: receiverId,
    type: "dm",
    fromUserId: session.user.id,
    createdAt: new Date(),
  });
  return NextResponse.json({ message: "Message sent" });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const receiverId = searchParams.get("receiverId");
  if (!receiverId) {
    return NextResponse.json({ error: "Missing receiverId" }, { status: 400 });
  }
  const messages = Array.from(memoryStore.messages.values()).filter(
    (m) =>
      (m.senderId === session.user.id && m.receiverId === receiverId) ||
      (m.senderId === receiverId && m.receiverId === session.user.id)
  );
  return NextResponse.json(messages);
}
