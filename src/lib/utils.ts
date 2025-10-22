import { Role } from "@/types/type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User as SupaUser } from "@supabase/supabase-js";
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
