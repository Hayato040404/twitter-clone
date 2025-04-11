import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { memoryStore } from "@/lib/memoryStore";

export async function POST(request: Request) {
  const { email, username, password } = await request.json();
  if (!email || !username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (
    Array.from(memoryStore.users.values()).some(
      (u) => u.email === email || u.username === username
    )
  ) {
    return NextResponse.json(
      { error: "Email or username already exists" },
      { status: 400 }
    );
  }
  const id = Math.random().toString(36).slice(2);
  const passwordHash = await hash(password, 10);
  memoryStore.users.set(id, {
    id,
    username,
    email,
    passwordHash,
    isAdmin: username === "Hal",
    isBanned: false,
    followers: [],
    following: [],
    createdAt: new Date(),
  });
  return NextResponse.json({ message: "User created" });
}
