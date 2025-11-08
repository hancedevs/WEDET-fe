"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { otpSchema } from "@/lib/validation";
import Image from "next/image";

export function OTPForm() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setError("");

            if (value && index < 3) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join("");
        const result = otpSchema.safeParse({ otp: otpString });

        if (!result.success) {
            setError("Please enter a valid 4-digit OTP");
            return;
        }

        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push("/auth/login");
        } catch {
            setError("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setOtp(["", "", "", ""]);
            setError("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-white flex flex-col items-center justify-start px-6 pt-12 pb-8"
            style={{ fontFamily: "'Red Hat', sans-serif", fontWeight: 300 }}
        >
            <div className="mb-6">
                <Image
                    src="/logotwo.png"
                    alt="Company Logo"
                    width={100}
                    height={80}
                    className="w-auto h-auto"
                />
            </div>

            {/* Title */}
            <h1 className="text-[24px] text-[#959494] mb-4 leading-none font-normal text-center">
                <b>Phone number verification</b>
            </h1>

            {/* Subtitle */}
            <p className="text-[11px] text-[#959494] text-center mb-6 leading-none font-normal">
                We have four digit verification code to <br />{" "}
                <b>email@gmail.com</b>
            </p>

            {/* OTP Inputs */}
            <div className="flex gap-4 mb-6">
                {otp.map((digit, index) => (
                    <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                        className={`w-14 h-14 text-center text-lg font-bold border rounded-[20px] transition-all duration-200 text-black
              border-gray-300`}
                        style={{
                            backgroundColor: "#E9F4F4",
                            fontFamily: "'Red Hat', sans-serif",
                            fontWeight: 300,
                        }}
                    />
                ))}
            </div>

            {/* Error message */}
            {error && (
                <p className="text-red-500 text-[11px] mb-4 text-center font-normal">
                    {error}
                </p>
            )}

            {/* Resend Section */}
            <div className="text-center mb-6">
                <p className="text-[11px] text-[#959494] mb-1 font-normal">
                    Didn&apos;t receive OTP?
                </p>
                <button
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-green-500 text-[11px] font-medium hover:text-green-600 disabled:opacity-50 underline decoration-green-500 underline-offset-2"
                    style={{
                        fontFamily: "'Red Hat', sans-serif",
                        fontWeight: 300,
                    }}
                >
                    Resend Code
                </button>
            </div>

            {/* Verify Button */}
            <div className="w-full max-w-[250px]">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || otp.some((digit) => !digit)}
                    className="w-[250px] justify-center   bg-[#28B872] hover:bg-[#1f9d62] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 rounded-4xl text-[11px] transition-colors duration-200"
                    style={{
                        fontFamily: "'Red Hat', sans-serif",
                        fontWeight: 300,
                    }}
                >
                    {isLoading ? "Verifying..." : "Verify"}
                </button>
            </div>
        </div>
    );
}
