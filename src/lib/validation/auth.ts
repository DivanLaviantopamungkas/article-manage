import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, "Username Minimal 2 Karalter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  username: z.string().min(2, "Username Minimal 2 Karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  // role: z.enum(["User", "Admin"]),
});
