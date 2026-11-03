import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(100, "Email is too long")
      .transform((val) => val.trim().toLowerCase()),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(20, "Invalid token").max(200, "Invalid token"),
  }),
  body: z.object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password too long")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
  }),
});
