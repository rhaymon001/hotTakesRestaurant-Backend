import { z } from "zod";

export const businessInfoSchema = z.object({
  businessName: z
    .string({ required_error: "Business name is required" })
    .min(3, "Business name must be at least 3 characters")
    .max(100, "Business name cannot exceed 100 characters")
    .trim(),

  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .trim(),

  address: z.object({
    street: z
      .string({ required_error: "Street address is required" })
      .min(5, "Street address must be at least 5 characters")
      .trim(),

    city: z
      .string({ required_error: "City is required" })
      .min(2, "City must be at least 2 characters")
      .trim(),

    state: z
      .string({ required_error: "State is required" })
      .min(2, "State must be at least 2 characters")
      .trim(),
  }),

  contact: z.object({
    phone: z
      .string({ required_error: "Phone number is required" })
      .regex(/^[0-9+\-\s()]{10,20}$/, "Please enter a valid phone number")
      .trim(),

    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
  }),

  socialLinks: z.object({
    facebook: z
      .string()
      .url("Please enter a valid Facebook URL")
      .nullable()
      .optional(),

    instagram: z
      .string()
      .url("Please enter a valid Instagram URL")
      .nullable()
      .optional(),

    twitter: z
      .string()
      .url("Please enter a valid Twitter URL")
      .nullable()
      .optional(),
  }),
});
