import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/memoryStore";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tweets = Array.from(memoryStore.tweets.values())
    .filter((t) => t.userId === params.id)
    .map((t) => ({ ...t, user: memoryStore.users.get(t.userId) }));
  return NextResponse.json(tweets);
}
