import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memoryStore } from "@/lib/memoryStore";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = Array.from(memoryStore.notifications.values())
    .filter((n) => n.userId === session.user.id);

  return NextResponse.json(
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );
}
