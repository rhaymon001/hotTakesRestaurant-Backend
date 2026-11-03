import { z } from "zod";
import mongoose from "mongoose";

/* ------------------ Helpers ------------------ */
export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

/* ------------------ Create User ------------------ */
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email().max(100),
    role: z.enum(["user", "admin", "manager"]).optional(), // adjust roles
  }),
});

/* ------------------ Update User ------------------ */
export const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().max(100).optional(),
    role: z.enum(["user", "admin", "manager"]).optional(),
  }),
});

/* ------------------ Get/Delete User by ID ------------------ */
export const userIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
