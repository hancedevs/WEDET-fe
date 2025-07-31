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

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
 //booking steps schema
 export const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(5, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
});

 export const step2Schema = z.object({
  numberOfPeople: z.string().min(1, "Select number of people"),
  dietaryRestrictions: z.string().optional(),
  medicalConditions: z.string().optional(),
  specialRequests: z.string().optional(),
});

export const step3Schema = z.object({
  contactName: z.string().min(1, "Full name is required"),
  contactPhone: z.string().min(5, "Phone number is required"),
  relationship: z.string().min(1, "Select a relationship"),
});

export const step4Schema = z.object({
  agreed: z.boolean().default(false).refine(val => val === true, {
    message: "Please agree to the terms and conditions",
  }),
});



