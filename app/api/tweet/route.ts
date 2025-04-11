import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { memoryStore } from "@/lib/memoryStore";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { content, image } = await request.json();
  if (!content || content.length > 280) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }
  const id = Math.random().toString(36).slice(2);
  memoryStore.tweets.set(id, {
    id,
    userId: session.user.id,
    content,
    image,
    likes: [],
    retweets: [],
    createdAt: new Date(),
  });
  // メンション通知
  const mentions = content.match(/@[^\s@]+/g) || [];
  for (const mention of mentions) {
    const username = mention.slice(1);
    const mentionedUser = Array.from(memoryStore.users.values()).find(
      (u) => u.username === username
    );
    if (mentionedUser) {
      memoryStore.notifications.set(Math.random().toString(36).slice(2), {
        id: Math.random().toString(36).slice(2),
        userId: mentionedUser.id,
        type: "mention",
        fromUserId: session.user.id,
        tweetId: id,
        createdAt: new Date(),
      });
    }
  }
  return NextResponse.json({ message: "Tweet posted" });
}

export async function GET() {
  const tweets = Array.from(memoryStore.tweets.values()).map((tweet) => ({
    ...tweet,
    user: memoryStore.users.get(tweet.userId),
  }));
  return NextResponse.json(
    tweets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );
}
