"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Eye, EyeOff } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { signupSchema } from "@/lib/validation";
import { toast } from "../ui/sonner";
import { cn } from "@/lib/utils";

import Logo from "../ui/Logo";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { AuthInput } from "../ui/AuthInput";
import { PrimaryButton } from "../ui/PrimaryButton";

type Gender = "male" | "female" | "";

interface FormState {
    firstName: string;
    lastName: string;
    dateOfBirth: Date | undefined;
    gender: Gender;
    email: string;
    password: string;
    agreeToTerms: boolean;
}

export default function Signupform() {
    const router = useRouter();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormState>({
        firstName: "",
        lastName: "",
        dateOfBirth: undefined,
        gender: "",
        email: "",
        password: "",
        agreeToTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Trim string inputs before setting state
        const newValue = type === "checkbox" ? checked : value.trim();

        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleDateChange = (date: Date | undefined) => {
        setFormData((prev) => ({ ...prev, dateOfBirth: date }));
        if (errors.dateOfBirth)
            setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
    };

    const handleGenderChange = (value: Gender) => {
        setFormData((prev) => ({ ...prev, gender: value }));
        if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
    };

    const handleTermsChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
        if (errors.agreeToTerms)
            setErrors((prev) => ({ ...prev, agreeToTerms: "" }));
    };

    const validateForm = () => {
        try {
            const validatedData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth
                    ? format(formData.dateOfBirth, "yyyy-MM-dd")
                    : undefined,
                gender: (formData.gender as Exclude<Gender, "">) || undefined,
                agreeToTerms: formData.agreeToTerms,
            };

            signupSchema.parse(validatedData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const next: Record<string, string> = {};
                for (const issue of error.issues) {
                    const field = String(issue.path[0] ?? "root");
                    next[field] = issue.message;
                }
                setErrors(next);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        setIsSubmitting(true);
        setErrors((prev) => ({ ...prev, root: "" }));

        const tid = toast.loading("Creating your account…");

        try {
            const {
                firstName,
                lastName,
                dateOfBirth,
                gender,
                email,
                password,
            } = formData;

            const dateString = dateOfBirth
                ? format(dateOfBirth, "yyyy-MM-dd")
                : undefined;

            const { data: signUpData, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstName,
                        lastName,
                        dateOfBirth: dateString,
                        gender,
                        role: "normal_user",
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                if (error.message.includes("User already registered")) {
                    toast.error(
                        "This email is already registered. Please log in.",
                        { id: tid }
                    );
                } else {
                    toast.error(error.message, { id: tid });
                }
                setErrors((p) => ({ ...p, root: error.message }));
                return;
            }

            // ✅ Detect existing unverified email
            if (
                signUpData?.user &&
                Array.isArray(signUpData.user.identities) &&
                signUpData.user.identities.length === 0
            ) {
                toast.error(
                    "This email is already pending verification. Please check your email inbox.",
                    {
                        id: tid,
                    }
                );
                return;
            }

            if (signUpData.session) await supabase.auth.signOut();

            toast.success(
                "Account created! Please check your email to verify your account and then log in.",
                { id: tid, duration: 8000 }
            );
            router.push("/auth/login");
        } catch (err: unknown) {
            console.error(err);
            const message =
                err instanceof Error ? err.message : "Something went wrong";
            toast.error(message, { id: tid });
            setErrors((p) => ({ ...p, root: message }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-auth-background flex flex-col">
            <Logo />
            <div
                className="flex-1 bg-white rounded-t-3xl px-6 py-8 absolute top-[90px] w-full "
                style={{
                    boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.08)",
                }}
            >
                <div className="max-w-sm mx-auto">
                    <h2 className="text-[16px] font-semibold text-gray-400 ml-1 mb-2 text-left">
                        Create your account
                    </h2>

                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="sm:rounded-lg">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {errors.root && (
                                    <p className="text-red-500 text-sm pl-2">
                                        {errors.root}
                                    </p>
                                )}

                                <div>
                                    <AuthInput
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        isError={!!errors.firstName}
                                        disabled={isSubmitting}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1 pl-2">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <AuthInput
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        isError={!!errors.lastName}
                                        disabled={isSubmitting}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1 pl-2">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    "rounded-full h-auto py-3.5 pl-6 border-gray-200 shadow",
                                                    "focus-visible:ring-[#28B872] focus-visible:ring-offset-0",
                                                    !formData.dateOfBirth
                                                        ? "text-gray-300"
                                                        : "text-gray-900",
                                                    errors.dateOfBirth
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                )}
                                                style={{
                                                    fontFamily:
                                                        "'Century Gothic'",
                                                    fontWeight: 300,
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                {formData.dateOfBirth ? (
                                                    format(
                                                        formData.dateOfBirth,
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>Date of birth</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0 bg-white"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={formData.dateOfBirth}
                                                onSelect={handleDateChange}
                                                month={formData.dateOfBirth}
                                                onMonthChange={(month) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        dateOfBirth: month,
                                                    }))
                                                }
                                                className="p-3"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.dateOfBirth && (
                                        <p className="text-red-500 text-xs mt-1 pl-2">
                                            {errors.dateOfBirth}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium pl-3 text-gray-500">
                                        Gender
                                    </label>
                                    <div className="mt-2 flex space-x-6 pl-3">
                                        {["male", "female"].map((g) => (
                                            <div
                                                className="flex items-center"
                                                key={g}
                                            >
                                                <input
                                                    id={g}
                                                    name="gender"
                                                    type="radio"
                                                    value={g}
                                                    className="h-4 w-4 accent-[#28B872] focus:ring-[#28B872]"
                                                    checked={
                                                        formData.gender === g
                                                    }
                                                    onChange={() =>
                                                        handleGenderChange(
                                                            g as Gender
                                                        )
                                                    }
                                                    disabled={isSubmitting}
                                                />
                                                <Label
                                                    htmlFor={g}
                                                    className={`ml-2 block text-sm capitalize cursor-pointer ${
                                                        formData.gender === g
                                                            ? "text-gray-800 font-normal"
                                                            : "text-gray-500 font-light"
                                                    }`}
                                                >
                                                    {g}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.gender && (
                                        <p className="text-red-500 text-xs mt-1 pl-2">
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <AuthInput
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        isError={!!errors.email}
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1 pl-2">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <AuthInput
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="New Password"
                                        isError={!!errors.password}
                                        disabled={isSubmitting}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() =>
                                            setShowPassword((s) => !s)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1 pl-2">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-start pt-2">
                                    <div className="mt-0.5">
                                        <Checkbox
                                            id="agreeToTerms"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onCheckedChange={handleTermsChange}
                                            disabled={isSubmitting}
                                            className="rounded-sm border-gray-300 data-[state=checked]:bg-[#28B872] data-[state=checked]:text-white focus-visible:ring-offset-0 focus-visible:ring-[#28B872]"
                                        />
                                    </div>
                                    <Label
                                        htmlFor="agreeToTerms"
                                        className="text-sm font-normal text-[#959494] ml-2 leading-relaxed cursor-pointer"
                                        style={{
                                            fontFamily:
                                                "'Century Gothic', sans-serif",
                                        }}
                                    >
                                        By selecting Create account I agree to
                                        wedet&apos;s terms of service and
                                        privacy policy.
                                    </Label>
                                </div>
                                {errors.agreeToTerms && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">
                                        {errors.agreeToTerms}
                                    </p>
                                )}

                                <div className="pt-4">
                                    <PrimaryButton
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Creating..."
                                            : "Create account"}
                                    </PrimaryButton>
                                </div>

                                <div className="text-center mt-6">
                                    <span
                                        className="text-gray-500 text-sm"
                                        style={{
                                            fontFamily:
                                                "'Century Gothic', sans-serif",
                                            fontWeight: 300,
                                        }}
                                    >
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                router.push("/auth/login");
                                            }}
                                            className="text-[#28B872] font-medium hover:underline"
                                        >
                                            Login
                                        </button>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
