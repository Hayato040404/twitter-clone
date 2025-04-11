import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { memoryStore } from "@/lib/memoryStore";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = Array.from(memoryStore.users.values()).find(
          (u) => u.email === credentials.email
        );
        if (!user || !(await compare(credentials.password, user.passwordHash!))) {
          return null;
        }
        if (user.isBanned) {
          throw new Error("Account is banned");
        }
        return { id: user.id, email: user.email, name: user.username };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      const dbUser = Array.from(memoryStore.users.values()).find(
        (u) => u.email === session.user.email
      );
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.isAdmin = dbUser.isAdmin;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
