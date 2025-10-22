"use client";

import React from "react";
import Logo from "@/components/ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validation";
import { ForgotPasswordFormData } from "@/types/type";

function Forgotpassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        console.log("Password reset requested for:", data.email);
        alert(
            `Demo: Password reset link would be sent to ${data.email}\n(No backend connected)`
        );
    };

    return (
        <div
            style={{
                fontFamily: "'Century Gothic', sans-serif",
                fontWeight: 300,
            }}
        >
            <Logo />
            <div className="absolute top-28 w-full bg-white flex flex-col border-t-2 rounded-t-3xl justify-center py-6 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-xl px-10 font-bold text-[#959494]">
                        Forgot Password
                    </h2>
                    <p className="px-10 mt-4 text-gray-500">
                        Enter email associated with your account to receive a
                        password reset link
                    </p>
                </div>
                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="px-10 sm:rounded-lg sm:px-10">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="mt-1">
                                    <Input
                                        {...register("email")}
                                        className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                                        placeholder="Enter Email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1 px-2">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Button
                                        type="submit"
                                        className="mx-auto flex justify-center py-6 px-27 rounded-3xl bg-green-600 font-medium text-lg"
                                    >
                                        Send me link
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forgotpassword;
