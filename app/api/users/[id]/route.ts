import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/memoryStore";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = memoryStore.users.get(params.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ ...user, passwordHash: undefined });
}
