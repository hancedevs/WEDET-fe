import { z } from "zod"

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(7, "Password must be at least 7 characters"),
})

// Signup Schema
export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date of birth",
    }),
  gender: z.string().refine(
    (val) => val === "male" || val === "female",
    { message: "Please select your gender" }
  ),
})

// OTP Schema
export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits"),
})

// Infer types from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type OTPFormData = z.infer<typeof otpSchema>
