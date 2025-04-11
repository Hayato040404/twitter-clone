import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { memoryStore } from "@/lib/memoryStore";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notifications = Array.from(memoryStore.notifications.values())
    .filter((n) => n.userId === session.user.id)
    .map((n) => ({
      ...n,
      fromUser: memoryStore.users.get(n.fromUserId),
    }));
  return NextResponse.json(
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );
}
