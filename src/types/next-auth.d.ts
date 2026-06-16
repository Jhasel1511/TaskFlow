// src/types/next-auth.d.ts
// Augment NextAuth types to include user.id in session

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
