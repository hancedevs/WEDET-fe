import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password must be less than 50 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be less than 50 characters")
  .regex(/^[a-zA-Z]+$/, "Must contain only letters");

export const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required")
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  })
  .refine((val) => {
    const dob = new Date(val);
    const now = new Date();
    return dob < now;
  }, "Date of birth must be in the past")
  .refine((val) => {
    const dob = new Date(val);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    return age >= 13;
  }, "You must be at least 13 years old");

export const genderSchema = z.enum(["male", "female"]).refine((val) => val, {
  message: "Please select your gender",
});

export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  dateOfBirth: dateOfBirthSchema,
  gender: genderSchema,
  agreeToTerms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions",
  }),
});

// Form-specific schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

// Profile update schema 
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  dateOfBirth: dateOfBirthSchema,
  gender: genderSchema,
  avatar: z.string().url("Please enter a valid URL").optional(),
});
