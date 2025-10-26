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

const DEFAULT_TOUR_BUCKET = "tours";
export const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
export const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);
export const getStringField = (obj: Record<string, unknown>, k: string) =>
    typeof obj[k] === "string" ? (obj[k] as string) : undefined;
export const getNumberField = (obj: Record<string, unknown>, k: string) =>
    typeof obj[k] === "number" && Number.isFinite(obj[k] as number)
        ? (obj[k] as number)
        : undefined;
export const getStringArray = (v: unknown): string[] | undefined =>
    Array.isArray(v) && v.every((x) => typeof x === "string")
        ? (v as string[])
        : undefined;

export async function toSignedUrl(
    bucket: string,
    path: string,
    secs = 60 * 60 * 6
) {
    const key = path.replace(new RegExp(`^${bucket}/`), "");
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(key, secs);
    if (!error && data?.signedUrl) return data.signedUrl;
    return supabase.storage.from(bucket).getPublicUrl(key).data.publicUrl;
}
export async function toImageUrlFromStorageKey(
    path: string,
    bucket = DEFAULT_TOUR_BUCKET
) {
    if (isFullUrl(path) || isDataUrl(path)) return path;
    return toSignedUrl(bucket, path);
}
export function fmtMoneyStr(n?: number | null): string {
    if (!Number.isFinite(n as number)) return "";
    return new Intl.NumberFormat("en-ET", { maximumFractionDigits: 0 }).format(
        n as number
    );
}
export function diffDaysInclusive(
    a?: string | null,
    b?: string | null
): number {
    if (!a || !b) return 0;
    const da = new Date(a);
    const db = new Date(b);
    if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 0;
    const ms = db.getTime() - da.getTime();
    return Math.max(1, Math.round(ms / (24 * 3600 * 1000)) + 1);
}

/** Build activities JSON string compatible with Detailfilter:
 * {
 *   "day1": { "activities": [{ "time": "08:00", "activity": "..." }], "meals": {...} },
 *   "day2": { ... }
 * }
 */
export function buildActivitiesJson(val: unknown): string | undefined {
    // if DB already stores correct JSON string, keep it
    if (typeof val === "string") {
        try {
            JSON.parse(val);
            return val;
        } catch {
            /* fall through and try to convert */
        }
    }

    // if we got an array of {time?, activity?}
    if (Array.isArray(val)) {
        const normalized = val
            .filter((x) => x && typeof x === "object")
            .map((x) => {
                const o = x as Record<string, unknown>;
                return {
                    time: typeof o.time === "string" ? o.time : undefined,
                    activity:
                        typeof o.activity === "string" ? o.activity : undefined,
                };
            });

        if (normalized.length) {
            const obj: Record<string, unknown> = {};
            // put all into day1 (we don't know day boundaries from array)
            obj["day1"] = { activities: normalized };
            return JSON.stringify(obj);
        }
    }

    // give up
    return undefined;
}

export function formatDateRange(start?: string | null, end?: string | null) {
    if (!start || !end) return "";
    const s = new Date(start),
        e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
    const sameYear = s.getFullYear() === e.getFullYear();
    const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
        d.toLocaleDateString("en-US", opts);
    return sameYear
        ? `${fmt(s, { month: "short", day: "numeric" })}-${fmt(e, {
              month: "short",
              day: "numeric",
              year: "numeric",
          })}`
        : `${fmt(s, { month: "short", day: "numeric", year: "numeric" })}-${fmt(
              e,
              { month: "short", day: "numeric", year: "numeric" }
          )}`;
}
export function todayDDMMYYYY(d = new Date()) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
export function makeBookingId(tourId: number) {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `WDT-${year}-${rand}${tourId.toString().padStart(2, "0")}`;
}
