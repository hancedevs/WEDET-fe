import { z } from "zod";

// email schema
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email must be at least 5 characters");
// password schema
export const passwordSchema = z
  .string()
  .min(7, "Password must be at least 7 characters")
  .max(50, "Password must be less than 50 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number");
// name schema
export const nameSchema = z
  .string()
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be less than 50 characters")
  .regex(/^[a-zA-Z]+$/, "Must contain only letters");
// gender schema
export const genderSchema = z.enum(["male", "female"]).refine((val) => val, {
  message: "Please select your gender",
});

//
export const dateOfBirthSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  })
  .refine((val) => {
    const dob = new Date(val);
    const now = new Date();
    return dob < now;
  }, "Date of birth must be in the past");

// Form-specific schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  dateOfBirth: dateOfBirthSchema,
  gender: genderSchema,
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

// Profile update schema that matches your User interface
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  dateOfBirth: dateOfBirthSchema,
  gender: genderSchema,
  avatar: z.string().url("Please enter a valid URL").optional(),
});
