import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memoryStore } from "@/lib/memoryStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const tweets = userId
    ? Array.from(memoryStore.tweets.values()).filter((t) => t.userId === userId)
    : Array.from(memoryStore.tweets.values());

  const enrichedTweets = tweets
    .map((t) => {
      const user = memoryStore.users.get(t.userId);
      if (!user) {
        // ユーザーが見つからない場合はスキップ
        return null;
      }
      return {
        ...t,
        user,
      };
    })
    .filter((t) => t !== null) // null を除外
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return NextResponse.json(enrichedTweets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, image } = await req.json();
  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const user = memoryStore.users.get(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const id = Math.random().toString(36).slice(2);
  const tweet = {
    id,
    userId: session.user.id,
    user,
    content,
    image,
    likes: [],
    retweets: [],
    createdAt: new Date(),
  };
  memoryStore.tweets.set(id, tweet);
  return NextResponse.json({ message: "Tweet posted" });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tweetId = searchParams.get("tweetId");
  const tweet = memoryStore.tweets.get(tweetId!);
  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }

  if (tweet.userId !== session.user.id && !session.user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  memoryStore.tweets.delete(tweetId!);
  return NextResponse.json({ message: "Tweet deleted" });
}
