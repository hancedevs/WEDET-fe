"use client";

import { useEffect, useMemo, useState } from "react";
import Logo from "../ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BussinessSignupSchema } from "@/lib/validation";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AuthInput } from "../ui/AuthInput";
type FormErrors = Record<string, string>;
type LicenseTuple = [File | null, File | null];

type BizForm = {
    BusinessName: string;
    registrationNumber: string;
    foundingDate: string;
    aboutBusiness: string;
    email: string;
    phoneNumber: string;
    fayidaId: string;
    password: string;
    licenseImages: LicenseTuple;
};

const MAX_FILE_SIZE_MB = 5;
const BUCKET_NAME = "business-licenses";
const fileOk = (f: File | null): boolean =>
    !f ||
    (f.type?.startsWith("image/") && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

const extFromName = (name?: string, mime?: string): string => {
    const nn = (name || "").split(".").pop()?.toLowerCase();
    if (nn) return nn;
    const mm = (mime || "").split("/")[1];
    return mm || "jpg";
};

const safeUUID = (): string =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

async function isRegNoTaken(regNo: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("registration_number_taken", {
        reg_no: regNo,
    });
    if (error) return false;
    return data === true;
}

export default function Signupform() {
    const router = useRouter();
    const search = useSearchParams();

    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<string>("");

    const [formData, setFormData] = useState<BizForm>({
        BusinessName: "",
        registrationNumber: "",
        foundingDate: "",
        aboutBusiness: "",
        email: "",
        phoneNumber: "",
        fayidaId: "",
        password: "",
        licenseImages: [null, null],
    });

    // previews for the 2 tiles
    const previews = useMemo<(string | null)[]>(
        () =>
            formData.licenseImages.map((f) =>
                f ? URL.createObjectURL(f) : null
            ),
        [formData.licenseImages]
    );
    useEffect(() => {
        return () => previews.forEach((u) => u && URL.revokeObjectURL(u));
    }, [previews]);
    useEffect(() => {
        const code = search.get("code");
        const token_hash = search.get("token_hash");

        // Nothing to do if not returning from email
        if (!code && !token_hash) return;

        const completeSignup = async (): Promise<void> => {
            setStatus("Finalizing your signup…");

            // 1) Exchange link for a session (TS expects a string)
            if (code) {
                await supabase.auth.exchangeCodeForSession(code);
            } else if (token_hash) {
            }

            // 2) Get authed user
            const { data: userRes, error: userErr } =
                await supabase.auth.getUser();
            if (userErr || !userRes.user)
                throw new Error("Could not get authenticated user.");
            const user = userRes.user;

            // 3) Rehydrate stashed form + pending object keys
            const stashRaw = localStorage.getItem("biz_signup_cache");
            const stash: Record<string, string> =
                (stashRaw
                    ? JSON.parse(stashRaw)
                    : user.user_metadata?.businessProfile) || {};
            const metaKeysRaw = localStorage.getItem("pending_keys");
            const metaKeys: string[] =
                (metaKeysRaw
                    ? JSON.parse(metaKeysRaw)
                    : user.user_metadata?.pendingKeys) || [];

            // 4) Move each pending object to <uid>/filename (optional but cleaner)
            const finalKeys: string[] = [];
            for (let i = 0; i < metaKeys.length; i++) {
                const from = metaKeys[i];
                const fileName =
                    from.split("/").pop() || `license_${i + 1}.jpg`;
                const to = `${user.id}/${fileName}`;
                const { error: mvErr } = await supabase.storage
                    .from(BUCKET_NAME)
                    .move(from, to);
                finalKeys.push(mvErr ? from : to); // if move fails, keep original
            }

            // 5) Convert keys to PUBLIC URLs (so table stores real links)
            const publicUrls = finalKeys.map(
                (key) =>
                    supabase.storage.from(BUCKET_NAME).getPublicUrl(key).data
                        .publicUrl
            );

            // 6) Upsert profile row
            const { error: upsertErr } = await supabase
                .from("business_profiles")
                .upsert(
                    {
                        user_id: user.id,
                        business_name: String(stash.BusinessName || ""),
                        registration_number: String(
                            stash.registrationNumber || ""
                        ),
                        founding_date: stash.foundingDate
                            ? String(stash.foundingDate)
                            : null,
                        about: stash.aboutBusiness
                            ? String(stash.aboutBusiness)
                            : null,
                        phone: stash.phoneNumber
                            ? String(stash.phoneNumber)
                            : null,
                        fayda_id: stash.fayidaId
                            ? String(stash.fayidaId)
                            : null,
                        email: String(stash.email || user.email || ""),
                        license_bucket: BUCKET_NAME,
                        // store PUBLIC URLs in license_paths
                        license_paths: publicUrls,
                    },
                    { onConflict: "user_id" }
                );
            if (upsertErr) throw new Error(upsertErr.message);
            localStorage.removeItem("biz_signup_cache");
            localStorage.removeItem("pending_keys");
            await supabase.auth.signOut();
            router.replace("/auth/login");
        };
        completeSignup().catch((e: unknown) => {
            const msg =
                e instanceof Error ? e.message : "Error completing signup";
            console.error(msg);
            setStatus(msg);
        });
    }, [router, search]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange =
        (slotIndex: 0 | 1) =>
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            const file = e.target.files?.[0] ?? null;

            if (file && !fileOk(file)) {
                let msg = "";
                if (!file.type?.startsWith("image/"))
                    msg = "Only image files (jpg, png, webp, heic, …)";
                else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
                    msg = `Max ${MAX_FILE_SIZE_MB}MB per file`;
                setErrors((p) => ({
                    ...p,
                    [`licenseImages-${slotIndex}`]: msg,
                }));
                return;
            }

            setFormData((prev) => {
                const next: LicenseTuple = [
                    ...prev.licenseImages,
                ] as LicenseTuple;
                next[slotIndex] = file;
                return { ...prev, licenseImages: next };
            });
            setErrors((p) => ({ ...p, [`licenseImages-${slotIndex}`]: "" }));
        };

    const validateForm = (): boolean => {
        try {
            BussinessSignupSchema.extend({
                password: z
                    .string()
                    .min(6, "Password must be at least 6 characters"),
            }).parse({ ...formData });

            if (
                !fileOk(formData.licenseImages[0]) ||
                !fileOk(formData.licenseImages[1])
            ) {
                throw new Error(
                    `Images must be type image/* and ≤ ${MAX_FILE_SIZE_MB}MB`
                );
            }
            setErrors({});
            return true;
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                const next: FormErrors = {};
                err.issues.forEach((i) => {
                    const key = String(i.path[0] ?? "root");
                    next[key] = i.message;
                });
                setErrors(next);
            } else if (err instanceof Error) {
                setErrors((p) => ({ ...p, licenseImages: err.message }));
            }
            return false;
        }
    };

    //submit
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const email = formData.email.trim().toLowerCase();
            const password = formData.password;
            const regNo = formData.registrationNumber.trim();

            if (await isRegNoTaken(regNo)) {
                setErrors((p) => ({
                    ...p,
                    registrationNumber:
                        "Registration number already exists. Use a different one.",
                }));
                return;
            }

            // 1) Upload files ANONYMOUSLY to public bucket under pending/<nonce>/*
            const nonce = safeUUID();
            const pendingPrefix = `pending/${nonce}`;
            const uploadedKeys: string[] = [];

            for (let i = 0; i < formData.licenseImages.length; i++) {
                const f = formData.licenseImages[i];
                if (!f) continue;
                const ext = extFromName(f.name, f.type);
                const key = `${pendingPrefix}/license_${i + 1}.${ext}`;
                const { error } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(key, f, { upsert: true, cacheControl: "3600" });
                if (error) throw new Error(error.message);
                uploadedKeys.push(key);
            }

            // 2) Stash minimal data for callback
            const stash = {
                BusinessName: formData.BusinessName,
                registrationNumber: regNo,
                foundingDate: formData.foundingDate,
                aboutBusiness: formData.aboutBusiness,
                phoneNumber: formData.phoneNumber,
                fayidaId: formData.fayidaId,
                email,
            };
            localStorage.setItem("biz_signup_cache", JSON.stringify(stash));
            localStorage.setItem("pending_keys", JSON.stringify(uploadedKeys));

            // 3) Sign up; redirect BACK to this same page for the callback
            const callbackUrl = `${window.location.origin}${window.location.pathname}`;
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: callbackUrl,
                    data: {
                        role: "business_user",
                        businessProfile: stash,
                        pendingKeys: uploadedKeys, // backup for callback
                    },
                },
            });
            if (signUpError) throw new Error(signUpError.message);

            // 4) Send to login while they verify
            router.replace("/auth/login");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Signup failed";
            console.error(msg);
            setErrors((p) => ({ ...p, root: msg }));
        }
    };

    return (
        <div className="min-h-screen bg-auth-background flex flex-col">
            <Logo />

            {/* Main Form Card */}
            <div
                className="absolute top-[90px] w-full bg-white rounded-t-3xl px-6 py-8 flex flex-col"
                style={{ boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.07)" }}
            >
                <div className="max-w-sm mx-auto w-full">
                    {/* Title */}
                    <h2 className="text-[16px] font-semibold text-gray-400 ml-1 mb-2 text-left">
                        Business Profile
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Business name */}
                        <div className="flex flex-col gap-1">
                            <AuthInput
                                name="BusinessName"
                                value={formData.BusinessName}
                                onChange={handleChange}
                                placeholder="Bussiness Name"
                                className="rounded-full border-gray-200 shadow text-gray-900 focus:ring-[#28B872] focus-visible:ring-offset-0"
                            />
                            {errors.BusinessName && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.BusinessName}
                                </p>
                            )}
                        </div>

                        {/* Registration Number */}
                        <div className="flex flex-col gap-1">
                            <AuthInput
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                placeholder="Registration Number"
                                className="rounded-full border-gray-200 shadow text-gray-900 focus:ring-[#28B872]"
                            />
                            {errors.registrationNumber && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.registrationNumber}
                                </p>
                            )}
                        </div>

                        {/* Founding date */}
                        <div className="flex flex-col gap-1 relative w-full">
                            <div className="relative w-full">
                                <div
                                    className="border border-gray-200 p-3 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-[#28B872] focus-within:border-[#28B872]"
                                    style={{
                                        fontFamily: "'Red Hat', sans-serif",
                                    }}
                                >
                                    {/* Fake placeholder */}
                                    {!formData.foundingDate && (
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                                            Founding date
                                        </span>
                                    )}

                                    <input
                                        type="date"
                                        name="foundingDate"
                                        value={formData.foundingDate}
                                        onChange={handleChange}
                                        className="w-full text-gray-900 bg-transparent relative z-10"
                                    />
                                </div>

                                {/* Calendar icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>

                            {errors.foundingDate && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.foundingDate}
                                </p>
                            )}
                        </div>

                        {/* About */}
                        <div className="flex flex-col gap-1">
                            <textarea
                                name="aboutBusiness"
                                placeholder="About your business"
                                value={formData.aboutBusiness}
                                onChange={handleChange}
                                className="rounded-3xl w-full p-4 border-input flex h-36  shadow focus:ring-[#28B872] text-gray-400"
                                rows={4}
                                style={{
                                    fontFamily: "'Red Hat', sans-serif",
                                }}
                            />
                            {errors.aboutBusiness && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.aboutBusiness}
                                </p>
                            )}
                        </div>

                        <h2 className="text-[16px] font-semibold text-gray-400 ml-1 mb-2 text-left">
                            Account owner
                        </h2>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <AuthInput
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="rounded-full border-gray-200 shadow text-gray-900 focus:ring-[#28B872]"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1">
                            <AuthInput
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone number"
                                className="rounded-full border-gray-200 shadow focus:ring-[#28B872]"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>

                        {/* Fayda ID */}
                        <div className="flex flex-col gap-1">
                            <AuthInput
                                name="fayidaId"
                                value={formData.fayidaId}
                                onChange={handleChange}
                                placeholder="Fayda ID number"
                                className="rounded-full border-gray-200 shadow focus:ring-[#28B872]"
                            />
                            {errors.fayidaId && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.fayidaId}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <AuthInput
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded-full border-gray-200 shadow focus:ring-[#28B872]"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs pl-2">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Upload business license */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm pl-1">
                                Upload business license
                            </label>
                            <div className="flex gap-4">
                                {[0, 1].map((idx) => (
                                    <label
                                        key={idx}
                                        className="w-24 h-24 cursor-pointer border-2 border-dashed border-[#28B872] rounded-lg flex items-center justify-center bg-white overflow-hidden"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange(idx)}
                                        />
                                        {previews[idx] ? (
                                            <img
                                                src={previews[idx]}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[#28B872] text-xs">
                                                Upload
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Button */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full rounded-full bg-[#28B872] hover:bg-[#23a766] text-white font-medium py-3"
                            >
                                Verify
                            </Button>
                        </div>

                        {/* Existing account */}
                        <div className="text-center mt-4">
                            <span className="text-gray-500 text-sm">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push("/auth/login")}
                                    className="text-[#28B872] font-medium hover:underline"
                                >
                                    Login
                                </button>
                            </span>
                        </div>

                        {/* Status + Root errors */}
                        {status && (
                            <p className="text-sm text-gray-600 text-center">
                                {status}
                            </p>
                        )}
                        {errors.root && (
                            <p className="text-red-600 text-sm text-center">
                                {errors.root}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
