// src/app/api/auth/[...nextauth]/route.ts
// Auth.js catch-all route handler

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
