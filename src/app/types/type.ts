import { z } from "zod";
import { loginSchema, signupSchema, otpSchema } from "@/lib/validation";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  avatar?: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: string;
  price: string;
  duration: string;
  image: string;
  agency: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Schema types 
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;

// utility types
export type Gender = "male" | "female"; 
export type AuthType = "login" | "signup" | "forgot-password" | "otp";