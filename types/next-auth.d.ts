import { Session, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string;
      name?: string;
      image?: string;
      isAdmin?: boolean;
    };
  }

  interface User {
    id: string;
    email?: string;
    name?: string;
    isAdmin?: boolean;
  }
}
