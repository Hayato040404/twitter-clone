import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/memoryStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();
  if (!query) return NextResponse.json([]);
  const tweets = Array.from(memoryStore.tweets.values())
    .filter((t) => t.content.toLowerCase().includes(query))
    .map((t) => ({ ...t, user: memoryStore.users.get(t.userId) }));
  return NextResponse.json(tweets);
}
