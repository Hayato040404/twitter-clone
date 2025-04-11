import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memoryStore } from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, ban } = await req.json();
  const user = memoryStore.users.get(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.isBanned = ban;
  memoryStore.users.set(userId, user);
  return NextResponse.json({ message: `User ${ban ? "banned" : "unbanned"}` });
}
