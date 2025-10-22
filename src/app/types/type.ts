import { z } from "zod";
import type { SVGProps } from "react";
import { LucideIcon } from "lucide-react";
import {
    loginSchema,
    signupSchema,
    otpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    step2Schema,
    step3Schema,
    step4Schema,
    step1Schema,
} from "@/lib/validation";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: "male" | "female";
    avatar?: string;
}
export interface SignupFormDatas {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
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

export interface TravelCardProps {
    imageUrl: string;
    placeName: string;
    location: string;
    tripDuration: string;
    price?: number | string;
    oldPrice?: string | number;
    discountPercent?: number;
    rating: number;
    reviews: number;
    agencyName: string;
}

//BookingFormType
export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
}

export interface TripSummary {
    title: string;
    location: string;
    dateRange: string;
    duration: string;
    guide: string;
}
//Tips Summary
export interface TripSummaryData {
    imageUrl: string;
    title: string;
    location: string;
    dateRange: string;
    duration: string;
    guide: string;
}

export type TripStatus = "upcoming" | "confirming" | "wishlist";

export type Trip = {
    id: string;
    title: string;
    location: string;
    priceBr: number;
    durationDays: number;
    imageUrl: string;
    status: TripStatus;
    available?: boolean;
};

// Tourguie type

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export type StepControllerProps = {
    prevHref?: string;
    nextHref?: string;
    showPrev?: boolean;
    canPrev?: boolean;
    canNext?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
    className?: string;
};

// Tourguide navbar
export type NavValue =
    | "explore"
    | "my-trips"
    | "profile"
    | "dashbord"
    | "Tour_profile";

export type NavItem = {
    href: string;
    label: string;
    value: NavValue;
    Icon: LucideIcon;
};

export type NavbarProps = {
    active?: NavValue;
};
// Schema types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;

// utility types
export type Gender = "male" | "female";
export type AuthType = "login" | "signup" | "forgot-password" | "otp";

export type PostAction = "save" | "schedule";
export type ScheduleType = "oneTime" | "scheduled";

export interface StepthreeFormData {
    price: number;
    discount?: number;
    total: number;
    includes?: string[];
    notIncludes?: string[];
    essentialEquipment?: string[];
    postAction: PostAction;
    scheduleType: ScheduleType;
    scheduleAt?: Date;
}
// Centralized types

export interface Passenger {
    name: string;
    email: string;
    phone?: string;
    status?: "Paid" | "Pending" | "Cancelled" | string;
    amountBr: number;
    people: number;
    location: string;
    dateISO: string;
    time: string;
    note?: string;
}

export type Role = "normal_user" | "business_user";
