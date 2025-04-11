import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { memoryStore } from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tweetId } = await req.json();
  const tweet = memoryStore.tweets.get(tweetId);
  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }

  if (!tweet.retweets.includes(session.user.id)) {
    tweet.retweets.push(session.user.id);
    memoryStore.tweets.set(tweetId, tweet);

    if (session.user.id !== tweet.userId) {
      const user = memoryStore.users.get(session.user.id)!;
      memoryStore.notifications.set(tweet.userId, {
        id: Date.now().toString(),
        userId: tweet.userId,
        type: "retweet",
        fromUser: user, // fromUserId から fromUser に変更
        createdAt: new Date(),
      });
    }
  }

  return NextResponse.json({ message: "Retweeted successfully" });
}
