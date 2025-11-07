"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "../ui/Logo";

import type { LoginFormData } from "@/types/type";
import { loginPasswordSchema, loginSchema } from "@/lib/validation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "../ui/sonner";
import { getUserRole, isEmailVerified } from "@/lib/utils";
import { AuthInput } from "../ui/AuthInput";
import { PrimaryButton } from "../ui/PrimaryButton";

export function LoginPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginPasswordSchema) });

    const onSubmit = async (data: LoginFormData) => {
        setSubmitting(true);
        const tid = toast.loading("Logging you in…");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                const msg = (error.message || "").toLowerCase();

                if (msg.includes("confirm") && msg.includes("email")) {
                    try {
                        await supabase.auth.resend({
                            type: "signup",
                            email: data.email,
                            options: {
                                emailRedirectTo: `${window.location.origin}/auth/callback`,
                            },
                        });
                        toast.error(
                            "Please confirm your email. I re-sent the confirmation link to your inbox.",
                            { id: tid }
                        );
                    } catch {
                        toast.error(
                            "Please confirm your email. Couldn't resend automatically—check your inbox for the original link.",
                            { id: tid }
                        );
                    }
                    return;
                }

                toast.error(error.message || "Login failed", { id: tid });
                return;
            }

            // ---------- ROLE + BUSINESS EMAIL VERIFY GATE ----------
            const { data: userData } = await supabase.auth.getUser();
            const authUser = userData?.user;
            if (!authUser) {
                toast.error("No active session after login.", { id: tid });
                return;
            }

            const role = await getUserRole(authUser);

            // If business user: block until email verified
            if (role === "business_user" && !isEmailVerified(authUser)) {
                try {
                    await supabase.auth.resend({
                        type: "signup",
                        email: authUser.email ?? data.email,
                        options: {
                            emailRedirectTo: `${window.location.origin}/auth/callback`,
                        },
                    });
                } catch {
                    /* ignore resend failure; still block */
                }
                await supabase.auth.signOut();
                toast.error(
                    "Please verify your email to access the business dashboard. We’ve sent a confirmation link.",
                    { id: tid }
                );
                return;
            }

            // Optional: sync your user table (typed payload, no any)
            await supabase
                .from("user")
                .upsert(
                    { id: authUser.id, email: authUser.email, role },
                    { onConflict: "id" }
                );

            toast.success("Welcome back! 🎉", { id: tid });
            router.replace(role === "business_user" ? "/TourDash" : "/home");
            // -------------------------------------------------------
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogle = async () => {
        toast.message("Redirecting to Google…");
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    };

    const handleApple = async () => {
        toast.message("Redirecting to Apple…");
        await supabase.auth.signInWithOAuth({
            provider: "apple",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    };

    const handlePhone = () => {
        toast.info("Enter your phone number to get a code");
        router.push("/auth/phone");
    };

    const handleNavigateToSignup = () => router.push("/auth/signup");
    const handleNavigateToBussinessSignup = () =>
        router.push("/auth/BussinesRegistration");
    const handleNavigateToforgotpassword = () =>
        router.push("/auth/forgotpassword");

    return (
        <div className="min-h-screen bg-auth-background flex flex-col">
            {/* Logo */}
            <Logo />

            {/* Main Content */}
            {/* Adjusted top position to match image better */}
            <div
                className="flex-1 bg-white rounded-t-3xl px-6 py-8 absolute top-[100px] w-full  shadow-lg"
                style={{
                    boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.08)",
                }}
            >
                <div className="max-w-sm mx-auto">
                    {/*  header */}
                    <h1 className="text-[16px] font-semibold text-gray-400 ml-1 mb-2 text-left">
                        Login to your account
                    </h1>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Email using AuthInput */}
                        <div>
                            <AuthInput
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="Email Address"
                                isError={!!errors.email}
                                disabled={submitting}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500 pl-2">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password with eye toggle using AuthInput */}
                        <div className="relative">
                            <AuthInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="Password"
                                isError={!!errors.password}
                                disabled={submitting}
                                autoComplete="current-password"
                                className="pr-12" // Add space for the toggle button
                            />
                            <button
                                type="button"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword((v) => !v)}
                                disabled={submitting}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500 pl-2">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handleNavigateToforgotpassword}
                                className="text-sm text-gray-400 hover:underline"
                                style={{
                                    fontFamily: "'Century Gothic'",
                                    fontWeight: 300,
                                }}
                                disabled={submitting}
                            >
                                Forget Password?
                            </button>
                        </div>

                        <PrimaryButton type="submit" disabled={submitting}>
                            {submitting ? "Logging in…" : "Login"}
                        </PrimaryButton>

                        {/* OR Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span
                                    className="px-2 bg-white text-gray-500"
                                    style={{
                                        fontFamily:
                                            "'Century Gothic', sans-serif",
                                        fontWeight: 300,
                                    }}
                                >
                                    or
                                </span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePhone}
                            className="w-full rounded-full py-5 border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center space-x-2 h-auto"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                                fontWeight: 300,
                            }}
                            disabled={submitting}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.57-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.44-.99-.99-.99z"
                                    fill="#4285F4"
                                />
                            </svg>
                            <span>Continue with phone</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogle}
                            className="w-full rounded-full py-5 border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center space-x-2 h-auto"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                                fontWeight: 300,
                            }}
                            disabled={submitting}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleApple}
                            className="w-full rounded-full py-5 border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center space-x-2 h-auto"
                            style={{
                                fontFamily: "'Century Gothic', sans-serif",
                                fontWeight: 300,
                            }}
                            disabled={submitting}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"
                                    fill="#000000"
                                />
                                <path
                                    d="M15.53 3.83c.869-1.02 1.429-2.44 1.275-3.83-1.233.039-2.724.821-3.606 1.854-.78.896-1.454 2.338-1.274 3.714 1.338.104 2.715-.688 3.605-1.738z"
                                    fill="#000000"
                                />
                            </svg>
                            <span>Continue with Apple</span>
                        </Button>

                        {/* Signup Link */}
                        <div className="text-center mt-6">
                            <span
                                className="text-gray-500 text-sm"
                                style={{
                                    fontFamily: "'Century Gothic', sans-serif",
                                    fontWeight: 300,
                                }}
                            >
                                Don&apos;t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={handleNavigateToSignup}
                                    className="text-[#28B872] font-medium hover:underline"
                                >
                                    signup
                                </button>
                            </span>
                        </div>

                        {/* Business Signup Link */}
                        <div className="text-center mt-6">
                            <span
                                className="text-gray-500 text-sm"
                                style={{
                                    fontFamily: "'Century Gothic', sans-serif",
                                    fontWeight: 300,
                                }}
                            >
                                Don&apos;t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={handleNavigateToBussinessSignup}
                                    className="text-[#28B872] font-medium hover:underline"
                                >
                                    Registartion as Bussiness
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
