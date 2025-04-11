import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { memoryStore } from "@/lib/memoryStore";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tweetId } = await request.json();
  if (!memoryStore.tweets.has(tweetId)) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }
  memoryStore.tweets.delete(tweetId);
  return NextResponse.json({ message: "Tweet deleted" });
}
