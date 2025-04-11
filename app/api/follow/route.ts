import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { memoryStore } from "@/lib/memoryStore";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { targetUserId } = await request.json();
  const user = memoryStore.users.get(session.user.id);
  const target = memoryStore.users.get(targetUserId);
  if (!user || !target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (!user.following.includes(targetUserId)) {
    user.following.push(targetUserId);
    target.followers.push(session.user.id);
    memoryStore.notifications.set(Math.random().toString(36).slice(2), {
      id: Math.random().toString(36).slice(2),
      userId: targetUserId,
      type: "follow",
      fromUserId: session.user.id,
      createdAt: new Date(),
    });
  }
  return NextResponse.json({ message: "Followed" });
}
