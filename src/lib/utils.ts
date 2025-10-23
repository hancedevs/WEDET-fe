import { Role } from "@/types/type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User as SupaUser, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const ONBOARDING_STEPS = [
    {
        id: 1,
        title: "Welcome to Wedet",
        description:
            "Your personal productivity companion to help you stay organized and efficient",
        image: "/Picture1.png",
    },
    {
        id: 2,
        title: "Task Management",
        description:
            "Easily create, organize and track all your tasks in one place",
        image: "/Picture2.png",
    },
    {
        id: 3,
        title: "Collaboration",
        description:
            "Work seamlessly with your team on shared projects and tasks",
        image: "/Picture3.png",
    },
    {
        id: 4,
        title: "Analytics",
        description:
            "Get insights into your productivity with detailed analytics",
        image: "/Picture4.png",
    },
];
export function isRole(v: unknown): v is Role {
    return v === "normal_user" || v === "business_user";
}

export function isEmailVerified(u: SupaUser): boolean {
    // Supabase exposes both; either being set means verified
    return Boolean(u.email_confirmed_at || u.confirmed_at);
}

export async function getUserRole(u: SupaUser): Promise<Role> {
    // 1) prefer auth metadata
    const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
    const metaRole = meta["role"];
    if (isRole(metaRole)) return metaRole;

    // 2) fallback to your public.user table
    type UserRow = { role: Role } | null;
    const { data } = await supabase
        .from("user")
        .select("role")
        .eq("id", u.id)
        .maybeSingle();
    const row = data as UserRow;
    return isRole(row?.role) ? row.role : "normal_user";
}

export function getUserInfo(user: User) {
    const meta = user.user_metadata ?? {};
    const id0 = user.identities?.[0]?.identity_data ?? {};

    const pickStr = (
        obj: Record<string, unknown>,
        key: string
    ): string | null =>
        typeof obj[key] === "string" && obj[key] ? (obj[key] as string) : null;

    const firstName =
        pickStr(meta, "firstName") ??
        pickStr(meta, "first_name") ??
        pickStr(meta, "given_name") ??
        pickStr(id0, "firstName") ??
        pickStr(id0, "first_name") ??
        pickStr(id0, "given_name") ??
        (typeof meta["name"] === "string"
            ? (meta["name"] as string).split(" ")[0]
            : null) ??
        (typeof id0["name"] === "string"
            ? (id0["name"] as string).split(" ")[0]
            : null) ??
        (typeof user.email === "string" ? user.email.split("@")[0] : null);

    const lastName =
        pickStr(meta, "lastName") ??
        pickStr(meta, "last_name") ??
        pickStr(meta, "family_name") ??
        pickStr(id0, "lastName") ??
        pickStr(id0, "last_name") ??
        pickStr(id0, "family_name");

    const avatarUrl =
        pickStr(meta, "avatar_url") ??
        pickStr(meta, "picture") ??
        pickStr(id0, "avatar_url") ??
        pickStr(id0, "picture");

    const email = user.email ?? null;
    const phone = user.phone ?? null;
    const userId = user.id ?? null;

    return { userId, firstName, lastName, email, phone, avatarUrl };
}
