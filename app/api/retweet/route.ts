import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { memoryStore } from "@/lib/memoryStore";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tweetId } = await request.json();
  const tweet = memoryStore.tweets.get(tweetId);
  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }
  if (!tweet.retweets.includes(session.user.id)) {
    tweet.retweets.push(session.user.id);
    memoryStore.notifications.set(Math.random().toString(36).slice(2), {
      id: Math.random().toString(36).slice(2),
      userId: tweet.userId,
      type: "retweet",
      fromUserId: session.user.id,
      tweetId,
      createdAt: new Date(),
    });
  }
  return NextResponse.json({ message: "Retweeted" });
}
