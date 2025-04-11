import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memoryStore } from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();
  const user = memoryStore.users.get(session.user.id);
  const targetUser = memoryStore.users.get(targetUserId);

  if (!user || !targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.following.push(targetUserId);
  targetUser.followers.push(session.user.id);
  memoryStore.users.set(session.user.id, user);
  memoryStore.users.set(targetUserId, targetUser);

  if (session.user.id !== targetUserId) {
    memoryStore.notifications.set(targetUserId, {
      id: Date.now().toString(),
      userId: targetUserId,
      type: "follow",
      fromUser: user, // fromUserId から fromUser に変更
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ message: "Followed successfully" });
}
