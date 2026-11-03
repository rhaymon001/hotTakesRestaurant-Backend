import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
      .refine((val) => val === val.trim(), {
        message: "Name cannot have leading/trailing spaces",
      }),

    email: z
      .string()
      .email("Please enter a valid email address")
      .max(100, "Email cannot exceed 100 characters")
      .transform((val) => val.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
  }),
});
