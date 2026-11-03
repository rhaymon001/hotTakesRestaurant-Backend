import { z } from "zod";

/* ------------------ Update My Profile ------------------ */
export const updateMyProfileSchema = z.object({
  body: z
    .object({
      fullName: z.string().min(2).max(100).optional(),
      email: z.string().email().max(100).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
});

/* ------------------ Change Password ------------------ */
export const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: z.string().min(6, "Old password is too short"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128)
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: "New password must be different from old password",
      path: ["newPassword"],
    }),
});
